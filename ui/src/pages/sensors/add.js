import { navigate } from "gatsby"
import React, { Component } from 'react'
import { connect } from 'mqtt/dist/mqtt'
import { Button, Icon, Card, List, Steps, Alert, Result, Switch, message } from "antd"

import LayoutPage from "../../components/LayoutPage"
import SEO from "../../components/seo"

const { Step } = Steps

class AddSensorPage extends Component {
  state = {
    id: null,
    name: '',
    room1: null,
    room1_name: null,
    room1_hidden: false,
    event1: null,
    room2: null,
    room2_name: null,
    room2_hidden: false,
    event2: null,
    rooms: [],
    sensors: [],
    allSensors: [],
    loading: true,
    loadingButton: false,
    step: 0,
    secondsToCalibration: null,
    timeSinceBoot: new Date().getTime() - 30000,
    waitingForSensorData: false,
    multipleSensorsFound: false,
    unknownError: false
  }

  componentDidMount() {
    this.setState({loading: true})
    const f1 = fetch(`${process.env.API_URL}api/1/rooms?include_hidden=true`)
      .then(resp => resp.json())
      .then(resp => this.setState({rooms: resp}))

    const f2 = fetch(`${process.env.API_URL}api/1/sensors?type=door`)
      .then(resp => resp.json())
      .then(resp => this.setState({sensors: resp}))

    Promise.all([f1, f2]).then(() => this.setState({loading: false})).then(() => this.listenMqtt())

    fetch(`${process.env.API_URL}api/1/sensors/manifest`)
      .then(resp => resp.json())
      .then(resp => this.setState({allSensors: Object.keys(resp).filter(id => resp[id].startsWith('door/'))}))
  }

  listenMqtt() {
    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => {
      client.subscribe('hiome/1/sensor/#', {qos: 1})
    })
    client.on('message', function(t, m, p) {
      if (m == null || this.state.multipleSensorsFound) return
      const sensorId = t.split('/')[3]
      // must be a sensor from manifest file that we don't know about, assuming we got a manifest file
      if ((this.state.allSensors.length > 0 && this.state.allSensors.indexOf(sensorId) < 0) ||
          this.state.sensors.map(s => s.id).indexOf(sensorId) >= 0) return

      const msg = JSON.parse(m.toString())
      if (msg['meta'] && msg['meta']['source'] === 'gateway' && typeof msg['val'] === 'string') {
        if (msg['val'].startsWith('V') && this.state.timeSinceBoot < msg['ts']) {
          this.setState({timeSinceBoot: msg['ts']})
        } else if (msg['type'] === 'raw_sensor_reading' && (msg['val'] === '1' || msg['val'] === '2') && msg['confidence'] >= 0.9) {
          if (!this.state.waitingForSensorData) return
          if (this.state.id === null || this.state.id === sensorId) {
            // this is our sensor
            if (this.state.event1 === null) {
              this.setState({id: sensorId, event1: msg['val'], waitingForSensorData: false, step: 1})
            } else {
              this.setState({id: sensorId, event2: msg['val'], waitingForSensorData: false, step: 2})
              this.saveSensor()
            }
          } else {
            // uh oh, there's another unknown sensor shooting off events at the same time. We can only handle one at a time
            this.setState({multipleSensorsFound: true})
          }
        }
      }
    }.bind(this))
  }

  onchange = (roomId, checked) => {
    this.setState({loadingButton: true})
    fetch(`${process.env.API_URL}api/1/rooms/${roomId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({hidden: checked, occupancy_count: 0})
    }).then(resp => resp.json()).then(resp =>
      roomId === this.state.room1 ? this.setState({room1_hidden: resp.hidden, loadingButton: false}) : this.setState({room2_hidden: resp.hidden, loadingButton: false}))
  }

  saveSensor() {
    let finalRoomId, finalSensorName
    const room1Id = this.state.room1 === 'external' ? '' : this.state.room1
    const room2Id = this.state.room2 === 'external' ? '' : this.state.room2
    if (this.state.event1 === '1' && this.state.event2 === '2') {
      // 2 -> 1
      finalRoomId = `${room2Id}::${room1Id}`
      finalSensorName = `${this.state.room2_name} <-> ${this.state.room1_name}`
    } else if (this.state.event1 === '2' && this.state.event2 === '1') {
      // 1 -> 2
      finalRoomId = `${room1Id}::${room2Id}`
      finalSensorName = `${this.state.room1_name} <-> ${this.state.room2_name}`
    } else {
      // something went wrong
      this.setState({unknownError: true})
      return
    }

    this.setState({name: finalSensorName, loading: true})
    fetch(`${process.env.API_URL}api/1/sensors`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.id,
        room_id: finalRoomId,
        name: finalSensorName,
        type: 'door'
      })
    }).then(resp => this.setState({loading: false}))

    return finalSensorName;
  }

  renderHiddenQ(roomId, roomName, roomHidden, otherRoomName) {
    if (roomId === 'external') return

    let room_sensors = this.state.sensors.filter(s => s.room_id.includes(roomId))
    room_sensors = room_sensors.map(s => {
      const names = s.name.split(' <-> ')
      return names[0].trim() === roomName ? names[1].trim() : names[0].trim()
    })
    const sensor_list = room_sensors.length === 0 ? `a door to` :
      `${room_sensors.length + 1} doors to ${room_sensors.join(', ')}${room_sensors.length > 1 ? ',' : ''} and`

    return (<p style={{whiteSpace: `pre-wrap`}}>
      <strong>{roomName}</strong> now has {sensor_list} {otherRoomName}. Are there any other doors in {roomName}? {`  `}
        <Switch
            key={`hideRoom${roomId}`}
            onChange={(checked, e) => this.onchange(roomId, checked)}
            checked={roomHidden}
            loading={this.state.loadingButton}
            checkedChildren="Yes"
            unCheckedChildren="No" />
    </p>)
  }

  renderHiddenDescription(roomId, roomHidden) {
    if (roomId === 'external') return
    if (roomHidden) {
      return <p>
        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#f8ac30" /> No problem, I'll hide this room for now until all its doors have Hiome Door sensors.
      </p>
    } else {
      return <p>
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> Awesome, you're all set!
      </p>
    }
  }

  renderFinished() {
    return (
      <Result status="success" title={`The ${this.state.name.replace('<->', 'to')} door is ready!`} subTitle="Enjoy your smarter door."
      extra={[
        <Button key="add_another" onClick={() => window.location.reload()} loading={this.state.loading}>Add Another Door</Button>,
        <Button key="all_done" type="primary" onClick={() => navigate("/")} loading={this.state.loading}>Done</Button>
      ]}>
        <div style={this.state.room1 === 'external' || this.state.room2 === 'external' ? {} : {marginBottom: `50px`}}>
          { this.renderHiddenQ(this.state.room1, this.state.room1_name, this.state.room1_hidden, this.state.room2_name) }
          { this.renderHiddenDescription(this.state.room1, this.state.room1_hidden) }
        </div>

        <div>
          { this.renderHiddenQ(this.state.room2, this.state.room2_name, this.state.room2_hidden, this.state.room1_name) }
          { this.renderHiddenDescription(this.state.room2, this.state.room2_hidden) }
        </div>
      </Result>
    )
  }

  addRoom = () => {
    let room_name = prompt("What is the name of this room?", "Living Room")
    if (!room_name || !room_name.trim()) return // no name given
    room_name = room_name.trim()

    // ignore if this room already exists
    if (this.state.rooms.map(r => r.name).indexOf(room_name) >= 0) {
      message.error(`${room_name} already exists!`)
      return
    }

    const room_id = Date.now() / 1000 | 0
    this.setState({loadingButton: true})
    fetch(`${process.env.API_URL}api/1/rooms`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: room_id, name: room_name, occupancy_count: (this.state.step === 0 ? 1 : 0), hidden: false})
    }).then(resp => this.selectRoom(room_id, room_name, false))
  }

  selectRoom = (roomId, roomName, roomHidden) => {
    if (this.state.step === 0) {
      this.setState({room1: roomId, room1_name: roomName, room1_hidden: roomHidden, waitingForSensorData: true, loadingButton: false})
    } else {
      this.setState({room2: roomId, room2_name: roomName, room2_hidden: roomHidden, waitingForSensorData: true, loadingButton: false})
    }
  }

  render5ftwarning() {
    if (this.state.step === 0)
      return <Alert type="warning" style={{margin: `20px auto`}}
          message="Make sure the Hiome Door sensor is powered on and you are standing at least 5 feet away from the door." />
    else return <br/>
  }

  renderRoomList() {
    const dataSource = this.state.rooms.concat([{id:'external', name: 'Outside'}]).filter(r => r.id !== this.state.room1)
    if (dataSource.length === 0) return <br/>
    return <List
      dataSource={dataSource}
      rowKey={item => `room${item.id}`}
      renderItem={room => <List.Item>
          <Card style={{textAlign: `center`, minWidth: `200px`}} hoverable={true} onClick={() => this.selectRoom(room.id, room.name, room.hidden)}>
            <div style={{
              textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap`
            }}>
              {room.name}
            </div>
          </Card>
        </List.Item>
      }
      loading={this.state.loading}
      grid={{
        gutter: 25,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 5,
      }} />
  }

  renderRooms() {
    return <>
      { this.render5ftwarning() }

      <p><strong>Which room are you standing in{this.state.step === 1 ? ' now' : ''}?</strong></p>

      { this.renderRoomList() }

      <Button style={{height: `50px`}} type="primary" block icon="plus"
        loading={this.state.loadingButton} onClick={this.addRoom}>Add New Room</Button>
    </>
  }

  renderOpenDoor() {
    return <svg width="80px" height="128px" viewBox="0 0 47 76" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fillRule="nonzero">
          <path d="M25.3,17.1 C25.3,14.8 25.4,9.2 25.4,7.1 C32.3,4.9 39.3,2.6 46.2,0.4 C46.3,22.7 46.2,53.2 46.3,75.4 L30.6,75.4 C31.1,74.5 31.4,73.5 31.4,72.4 L31.4,66.5 C31.4,64 31,61.5 30.3,59.1 L28.6,53.3 L28.3,47.4 C28.3,46.7 28.2,46 28.2,45.3 C29.9,46.3 31.7,47.2 33.5,47.9 C34.2,48.2 34.9,48.3 35.6,48.3 C36.8,48.3 37.9,48 38.8,47.3 C39.8,46.6 40.5,45.7 41,44.6 C42.2,41.6 40.7,38.3 37.7,37.1 C35.7,36.3 33.7,35.2 31.9,34 C30.3,32.8 28.8,31.4 27.5,29.9 C26.9,29.2 26.1,28.6 25.2,28.2 L25.2,27.9 C26.4,26.4 27.1,24.5 27.1,22.5 C27.1,20.5 26.6,18.6 25.3,17.1 Z" fill="#6F3CD1"></path>
          <path d="M25.5,39.8 C25.4,42.3 25.4,44.9 25.5,47.4 L25.8,53.7 L27.6,59.9 C28.2,62 28.6,64.2 28.6,66.5 L28.6,72.4 C28.6,74 27.3,75.3 25.7,75.3 L25.4,75.3 L25.4,31.4 C25.5,31.5 25.5,31.5 25.6,31.6 C27,33.3 28.7,34.8 30.5,36.1 C32.5,37.5 34.6,38.7 36.9,39.6 C38.4,40.2 39.2,41.9 38.6,43.4 C38.2,44.6 37,45.3 35.9,45.3 C35.5,45.3 35.2,45.2 34.8,45.1 C32,44 29.4,42.6 27.1,40.9 C26.5,40.6 26,40.2 25.5,39.8 Z" fill="#000000"></path>
          <path d="M36.8,39.7 C34.5,38.8 32.4,37.6 30.4,36.2 C28.6,34.9 27,33.4 25.5,31.7 C24.9,31 24.1,30.7 23.2,30.7 L21.5,30.7 L21.2,30.7 L15.7,30.7 C14.9,30.6 14.2,30.6 13.4,30.7 C8.3,31.3 5.3,35.7 3.7,38 C2,40.4 0.8,43.1 0.1,46 C-0.3,47.6 0.7,49.2 2.2,49.6 C2.4,49.7 2.7,49.7 2.9,49.7 C4.2,49.7 5.4,48.8 5.7,47.5 C6.3,45.3 7.2,43.2 8.4,41.4 C9.2,40.2 10.4,38.5 11.8,37.5 C12.1,42.4 12.1,47.3 11.7,52.1 L11.6,53.8 L10.6,57.8 C9.9,60.4 8.5,62.8 6.5,64.5 L3.3,67.3 C2.1,68.4 2,70.2 3,71.4 C4.1,72.6 5.9,72.7 7.1,71.7 L10.3,68.9 C13.2,66.3 15.3,63 16.3,59.2 L16.8,57.2 L20.7,57.2 L22,61.6 C22.5,63.2 22.7,64.8 22.7,66.5 L22.7,72.4 C22.7,74 24,75.3 25.6,75.3 C27.2,75.3 28.5,74 28.5,72.4 L28.5,66.5 C28.5,64.3 28.2,62.1 27.5,59.9 L25.7,53.7 L25.4,47.5 C25.3,45 25.3,42.4 25.4,39.8 C25.9,40.2 26.3,40.5 26.8,40.9 C29.2,42.6 31.8,44.1 34.5,45.1 C34.8,45.2 35.2,45.3 35.6,45.3 C36.8,45.3 37.9,44.6 38.3,43.4 C39.1,42 38.3,40.3 36.8,39.7 Z" fill="#000000"></path>
          <circle fill="#000000" cx="18.5" cy="22.5" r="5.9"></circle>
        </g>
      </g>
    </svg>
  }

  calibrationTimeRemaining() {
    return 20 - Math.floor((new Date().getTime() - this.state.timeSinceBoot)/1000)
  }

  updateCountdown = () => {
    const secondsToCalibration = this.calibrationTimeRemaining()
    if (secondsToCalibration < 1) clearInterval(this.timer)
    this.setState({secondsToCalibration})
  }

  renderWalkThroughDoor() {
    const timeRemaining = this.calibrationTimeRemaining()
    if (this.state.step === 0 && timeRemaining > 0) {
      if (!this.timer) this.timer = setInterval(this.updateCountdown, 1000)
      return <Result icon={<Icon type="loading" />} title="Calibrating Hiome Door"
        subTitle={<>
          <p>Almost ready... just {this.state.secondsToCalibration || timeRemaining} more seconds!</p>
          <Alert type="warning" message="Make sure you're standing at least 5 feet away from the door during calibration." />
        </>} />
    } else {
      return <Result icon={<Icon component={this.renderOpenDoor} />}
        title={`Walk ${this.state.step === 1 ? 'back ' : ''}through the door${this.state.step === 1 ? ' again' : ''}.`}
        subTitle={<><Icon type="loading" /> &nbsp; Waiting...</>} />
    }
  }

  renderMultipleSensorsError() {
    return <Result status="warning" title="Multiple Possible Sensors Detected"
      subTitle="It looks like multiple doors are being used right now."
      extra={[
        <Button key="contact" onClick={this.openHelpModal}>Contact Support</Button>,
        <Button key="try_again" type="primary" onClick={() => window.location.reload()}>Try Again</Button>
      ]}>
        <div><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> Make sure other people aren't walking around at the same time.</div>
        <br/>
        <div><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> Try unplugging other Hiome Door sensors that haven't been configured yet.</div>
      </Result>
  }

  renderUnknownError() {
    return <Result status="warning" title="Something Went Wrong"
      subTitle="The entry and exit did not match up. Make sure you only walk through the door when instructed."
      extra={[
        <Button key="contact" onClick={this.openHelpModal}>Contact Support</Button>,
        <Button key="try_again" type="primary" onClick={() => window.location.reload()}>Try Again</Button>
      ]} />
  }

  openHelpModal() {
    window.dispatchEvent(new Event("helpMe"))
  }

  renderStep() {
    if (this.state.multipleSensorsFound) {
      return this.renderMultipleSensorsError()
    } else if (this.state.unknownError) {
      return this.renderUnknownError()
    } else if (this.state.step === 0) {
      return this.state.room1 ? this.renderWalkThroughDoor() : this.renderRooms()
    } else if (this.state.step === 1) {
      return this.state.room2 ? this.renderWalkThroughDoor() : this.renderRooms()
    } else {
      return this.renderFinished()
    }
  }

  render() {
    return (
      <LayoutPage goBack={true}>
        <SEO title="Add Sensor" />
        <Steps size="small" labelPlacement="vertical" current={this.state.step}>
          <Step title={this.state.room1_name || 'Current Room'} />
          <Step title={this.state.room2_name || 'Adjoining Room'} />
          <Step title="Finish" />
        </Steps>

        { this.renderStep() }
      </LayoutPage>
    )
  }
}

export default AddSensorPage

import { Link, navigate } from "gatsby"
import React, { Component } from 'react'
import { connect } from 'mqtt/dist/mqtt'
import { Result, Button, Icon, Spin } from 'antd'

import LayoutPage from "../components/LayoutPage"
import SEO from "../components/seo"
import LogViewer from "../components/LogViewer"

import "./rooms.css"

class IndexPage extends Component {
  state = {
    rooms: [],
    loading: true,
    missingSensors: 0
  }

  componentDidMount() {
    fetch(`${process.env.API_URL}api/1/rooms`).then(resp => resp.json()).then(resp => this.setState({rooms: resp, loading: false}))

    let knownSensors = []
    let manifestSensors = []
    const f1 = fetch(`${process.env.API_URL}api/1/sensors/manifest`)
      .then(resp => resp.json())
      .then(resp => manifestSensors = Object.keys(resp).filter(id => resp[id].startsWith('door/')))
    const f2 = fetch(`${process.env.API_URL}api/1/sensors?type=door`)
      .then(resp => resp.json())
      .then(resp => knownSensors = resp.map(s => s.id))

    Promise.all([f1, f2]).then(() => {
      const missingSensors = manifestSensors.filter(id => !knownSensors.includes(id))
      this.setState({missingSensors: missingSensors.length})
    })

    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => client.subscribe('hiome/1/sensor/#', {qos: 1}))
    client.on('message', function(t, m, p) {
      if (m == null) return
      const message = JSON.parse(m.toString())
      if (message['meta']['type'] === 'occupancy' && message['meta']['source'] === 'gateway') {
        const rooms = this.state.rooms
        for (let r of rooms) {
          if (r.id === message['meta']['room']) {
            r.occupancy_count = message['val']
            this.setState({rooms})
            break
          }
        }
      }
    }.bind(this))
  }

  roomRow(room) {
    return (
      <Link key={room.id} to={`/rooms?id=${room.id}`}
        className={`room ${room.occupancy_count > 0 ? 'active' : ''}`}
        title={room.name}
      >
        <div style={{fontSize: `70px`, flexGrow: 2}}>{ room.occupancy_count }</div>
        { room.name }
      </Link>
    )
  }

  addRoomRow() {
    return (
      <Link key='add_sensor' to='sensors/add' className='room active' title='Add New Sensor'>
        <div style={{fontSize: `70px`, flexGrow: 2}}><Icon type="plus" /></div>
        Add {this.state.missingSensors} Door{this.state.missingSensors === 1 ? '' : 's'}
      </Link>
    )
  }

  renderRooms() {
    if (this.state.loading) {
      return <div style={{textAlign: `center`, marginTop: `10em`}}>
        <Spin size="large" indicator={<Icon type="loading" style={{color: "#fff"}}/>} />
      </div>
    } else if (this.state.rooms.length > 0) {
      const arr = []
      for (let r of this.state.rooms) {
        arr.push(this.roomRow(r))
      }
      if (this.state.missingSensors > 0)
        arr.push(this.addRoomRow())
      return arr
    } else {
      return <Result
        className="addNew"
        icon={<span role="img" aria-label="hurray" style={{fontSize: `5em`}}>🎉</span>}
        title="Welcome to Hiome!"
        subTitle={<p>This will be your dashboard, but it's a little empty right now. Let's add a door.</p>}
        extra={<Button onClick={() => navigate('/sensors/add')} type="primary" size="large" icon="plus">Add New Door</Button>}
      />
    }
  }

  headline() {
    return <div className="roomContainer">
      { this.renderRooms() }
    </div>
  }

  logsEndpoint() {
    if ((new URL(document.location)).searchParams.get('debug') === 'true') return 'api/1/logs/debug'
    return 'api/1/logs'
  }

  render() {
    return (
      <LayoutPage headline={this.headline()}>
        <SEO title="Rooms" />
        <LogViewer endpoint={this.logsEndpoint()} />
      </LayoutPage>
    )
  }
}

export default IndexPage

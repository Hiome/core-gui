import { Link, navigate } from "gatsby"
import React, { Component } from 'react'
import { Result, Button, Icon, Spin } from 'antd'

import LayoutPage from "../components/LayoutPage"
import SEO from "../components/seo"
import LogViewer from "../components/LogViewer"

import "./rooms.css"

class DebugPage extends Component {
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

  render() {
    return <LayoutPage headline={this.headline()}>
      <SEO title="Rooms" />
      <LogViewer endpoint="api/1/logs/debug" debug={true} />
    </LayoutPage>
  }
}

export default DebugPage

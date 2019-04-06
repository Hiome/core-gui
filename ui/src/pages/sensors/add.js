import React, { Component } from 'react'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

class AddSensorPage extends Component {
  state = {
    id: null,
    settingRoom1: true,
    room1: null,
    room1_name: null,
    room2: null,
    room2_name: null,
    rooms: []
  }

  async componentDidMount() {
    const params = (new URL(document.location)).searchParams
    this.setState({id: params.get('id'), room1: params.get('r1'), room2: params.get('r2')})
    const json = await fetch(`${process.env.API_URL}api/rooms`).then(resp => resp.json())
    this.setState({rooms: json})
  }

  updateRoom = (e) => {
    let room_id = e.target.value
    let room_name = e.target.options[e.target.selectedIndex].text
    const rooms = this.state.rooms
    if (room_id === "null") {
      room_id = null
      room_name = null
    }
    if (room_id === "new") {
      room_name = prompt("What is the name of this room?", "Living Room")
      if (!room_name) return
      room_id = Date.now() / 1000 | 0
      fetch(`${process.env.API_URL}api/rooms`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: room_id, name: room_name, occupancy_count: 0})
      })
      rooms.push({id: room_id, name: room_name, occupancy_count: 0})
    }

    if (this.state.settingRoom1) {
      this.setState({room1: room_id, room1_name: room_name, rooms: rooms})
    } else {
      this.setState({room2: room_id, room2_name: room_name, rooms: rooms})
    }
  }

  nextRoom = () => {
    if (this.state.room1 !== null) {
      this.setState({settingRoom1: false})
    }
  }

  saveSensor = async () => {
    if (this.state.room2) {
      const room1_id = this.state.room1 === 'external' ? '' : this.state.room1
      const room2_id = this.state.room2 === 'external' ? '' : this.state.room2

      await fetch(`${process.env.API_URL}api/sensors`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.state.id,
          room_id: `${room1_id}::${room2_id}`,
          name: `${this.state.room1_name} <-> ${this.state.room2_name}`,
          type: 'door'
        })
      }).then(resp => window.location.href = '/sensors')
    }
  }

  formQuestion() {
    if (this.state.settingRoom1) {
      return <label htmlFor="name">Which room is this sensor in?</label>
    }

    return <label htmlFor="name">Now walk through the door. Which room are you in now?</label>
  }

  renderButton() {
    if (this.state.settingRoom1) {
      return <button onClick={this.nextRoom}>Next</button>
    }

    return <button onClick={this.saveSensor}>Save</button>
  }

  renderRoomOptions() {
    const arr = []
    for (let r of this.state.rooms) {
      if (this.state.settingRoom1 || r.id !== this.state.room1) {
        arr.push(<option key={`room${r.id}`} value={r.id} >{r.name}</option>)
      }
    }
    return arr
  }

  renderExternalOption() {
    if (this.state.settingRoom1 || this.state.room1 !== 'external') {
      return <option value="external">Outside</option>
    }
  }

  renderRoomForm() {
    if (this.state.id === null) {
      return <p>Invalid QR Code...</p>
    }

    return (
      <div>
        { this.formQuestion() }

        <select onChange={this.updateRoom} value={this.state.settingRoom1 ? (this.state.room1 || "null") : (this.state.room2 || "null")}>
          <option value="null">Select a room...</option>
          { this.renderRoomOptions() }
          { this.renderExternalOption() }
          <option value="new">Add New Room</option>
        </select>

        { this.renderButton() }
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <SEO title="Hiome | Rooms" />
        <h1 style={{textAlign: `center`}}>Add Sensor</h1>
        <div style={{margin: `0 auto`, textAlign: `center`}}>
          { this.renderRoomForm() }
        </div>
      </Layout>
    )
  }
}

export default AddSensorPage

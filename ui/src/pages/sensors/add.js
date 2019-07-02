import React, { Component } from 'react'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import "./sensors.css"

class AddSensorPage extends Component {
  state = {
    id: null,
    settingRoom1: true,
    room1: null,
    room1_name: null,
    room1_hidden: null,
    room2: null,
    room2_name: null,
    room2_hidden: null,
    rooms: []
  }

  async componentDidMount() {
    const params = (new URL(document.location)).searchParams
    this.setState({id: params.get('id'), room1: params.get('r1'), room2: params.get('r2')})
    const json = await fetch(`${process.env.API_URL}api/1/rooms?include_hidden=true`).then(resp => resp.json())
    this.setState({rooms: json})
  }

  updateRoom = (e) => {
    let room_id = e.target.value
    let room_name = e.target.options[e.target.selectedIndex].text
    let room_hidden = null
    const rooms = this.state.rooms
    if (room_id === "null") {
      room_id = null
      room_name = null
    }
    if (room_id === "new") {
      room_name = prompt("What is the name of this room?", "Living Room")
      if (!room_name) return
      room_id = Date.now() / 1000 | 0
      fetch(`${process.env.API_URL}api/1/rooms`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: room_id, name: room_name, occupancy_count: 0, hidden: true})
      })
      rooms.push({id: room_id, name: room_name, occupancy_count: 0})
      room_hidden = true
    }

    if (this.state.settingRoom1) {
      this.setState({room1: room_id, room1_name: room_name, room1_hidden: room_hidden, rooms: rooms})
    } else {
      this.setState({room2: room_id, room2_name: room_name, room2_hidden: room_hidden, rooms: rooms})
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

      await fetch(`${process.env.API_URL}api/1/sensors`, {
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
      }).then(resp => window.location.href = '/')
    }
  }

  formQuestion() {
    if (this.state.settingRoom1) {
      return <label className="addQuestion" htmlFor="name">Which room is this sensor in?</label>
    }

    return <label className="addQuestion" htmlFor="name">Which room does this door lead to?</label>
  }

  renderButton() {
    if (this.state.settingRoom1) {
      if (this.state.room1 === null || this.state.room1_hidden === null) return
      return <button onClick={this.nextRoom}>Next</button>
    }

    if (this.state.room2 === null || this.state.room2_hidden === null) return
    return <button onClick={this.saveSensor}>Finish</button>
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
    if (!this.state.settingRoom1) { // sensor cannot go outside, so only side 2 can be external
      return <option value="external">Outside</option>
    }
  }

  showRoom = (e) => {
    const currentRoom = this.state.settingRoom1 ? this.state.room1 : this.state.room2
    if (!currentRoom || currentRoom === 'external') return
    fetch(`${process.env.API_URL}api/1/rooms/${currentRoom}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({hidden: false, occupancy_count: 0})
    }).then(resp => resp.json()).then(resp => this.state.settingRoom1 ?
      this.setState({room1_hidden: resp.hidden}) : this.setState({room2_hidden: resp.hidden}))
  }

  hideRoom = (e) => {
    const currentRoom = this.state.settingRoom1 ? this.state.room1 : this.state.room2
    if (!currentRoom || currentRoom === 'external') return
    fetch(`${process.env.API_URL}api/1/rooms/${currentRoom}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({hidden: true, occupancy_count: 0})
    }).then(resp => resp.json()).then(resp => this.state.settingRoom1 ?
      this.setState({room1_hidden: resp.hidden}) : this.setState({room2_hidden: resp.hidden}))
  }

  renderHiddenQ() {
    const currentRoom = this.state.settingRoom1 ? this.state.room1 : this.state.room2
    if (!currentRoom || currentRoom === 'external') return
    const currentRoomName = this.state.settingRoom1 ? this.state.room1_name : this.state.room2_name
    const currentRoomHidden = this.state.settingRoom1 ? this.state.room1_hidden : this.state.room2_hidden
    return (
      <p className="hiddenQ">
        Are all of the doors in { currentRoomName } now covered with Hiome Door sensors?
        <br/>
        <button onClick={this.showRoom} className={currentRoomHidden === false ? 'active' : ''}>Yes</button>
        <button onClick={this.hideRoom} className={currentRoomHidden === true ? 'active' : ''}>No</button>
      </p>
    )
  }

  renderRoomForm() {
    if (this.state.id === null) {
      return <p>Invalid QR Code...</p>
    }

    return (
      <div>
        { this.formQuestion() }
        <br/>

        <select onChange={this.updateRoom} value={this.state.settingRoom1 ? (this.state.room1 || "null") : (this.state.room2 || "null")}>
          <option value="null">Select a room...</option>
          { this.renderRoomOptions() }
          { this.renderExternalOption() }
          <option value="new">Add New Room</option>
        </select>
        <br/>
        { this.renderHiddenQ() }
        <br/>
        { this.renderButton() }
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <SEO title="Add Sensor" />
        <div style={{margin: `0 auto`, textAlign: `center`}}>
          { this.renderRoomForm() }
        </div>
      </Layout>
    )
  }
}

export default AddSensorPage

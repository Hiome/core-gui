import React, { Component } from 'react'
import { connect } from 'mqtt/dist/mqtt'

import Layout from "../components/layout"
import SEO from "../components/seo"

import "./rooms.css"

class IndexPage extends Component {
  state = {
    rooms: [],
  }

  async componentDidMount() {
    const json = await fetch(`${process.env.API_URL}api/1/rooms`).then(resp => resp.json())
    this.setState({rooms: json})
    const client = connect('ws://'+window.location.host+':1884')
    client.on('connect', () => client.subscribe('hiome/1/sensor/#', {qos: 1}))
    client.on('message', function(t, m, p) {
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

  async setOcc(room) {
    let count = 0
    if (room.occupancy_count > 0) {
      if (!window.confirm("Are you sure you want to reset occupancy count to 0?")) {
        return
      }
    } else {
      count = prompt(`How many people are in ${room.name}?`, 1)
      count = parseInt(count)
      if (isNaN(count) || count <= 0) return
      if (count > 100) count = 100
    }

    const json = await fetch(`${process.env.API_URL}api/1/rooms/${room.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({occupancy_count: count})
    }).then(resp => resp.json())

    const rooms = this.state.rooms
    for (let r of rooms) {
      if (r.id === json.id) {
        r.occupancy_count = json.occupancy_count
        this.setState({rooms})
        break
      }
    }
  }

  roomRow(room) {
    return (
      <div key={room.id} className={`room ${room.occupancy_count > 0 ? 'active' : ''}`}>
        <span className="clear_occ" onClick={this.setOcc.bind(this, room)}>
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" width="20" height="20"><g><path fill="#A17EDF" stroke="none" d=" M 84.25 24.25 Q 86.0037109375 22.4890625 86 20 86.0037109375 17.5109375 84.25 15.75 82.4890625 13.9962890625 80 14 77.5109375 13.9962890625 75.75 15.75 L 50 41.5 24.25 15.75 Q 22.4890625 13.9962890625 20 14 17.5109375 13.9962890625 15.75 15.75 13.9962890625 17.5109375 14 20 13.9962890625 22.4890625 15.75 24.25 L 41.5 50 15.75 75.75 Q 13.9962890625 77.5109375 14 80 13.9962890625 82.4890625 15.75 84.25 17.5109375 86.0037109375 20 86 22.4890625 86.0037109375 24.25 84.25 L 50 58.5 75.75 84.25 Q 77.5109375 86.0037109375 80 86 82.4890625 86.0037109375 84.25 84.25 86.0037109375 82.4890625 86 80 86.0037109375 77.5109375 84.25 75.75 L 58.5 50 84.25 24.25 Z"></path></g></svg>
        </span>
        <div style={{fontSize: `70px`, marginBottom: `40px`}}>{ room.occupancy_count }</div>
        { room.name }
      </div>
    )
  }

  renderRooms() {
    if (this.state.rooms.length > 0) {
      const arr = []
      for (let r of this.state.rooms) {
        arr.push(this.roomRow(r))
      }
      return arr
    } else {
      return <h2 style={{textAlign: `center`, color: `#A17EDF`, margin: `100px`}}>No rooms found.</h2>
    }
  }

  render() {
    return (
      <Layout>
        <SEO title="Rooms" />
        <div className="roomContainer">
          { this.renderRooms() }
        </div>
      </Layout>
    )
  }
}

export default IndexPage

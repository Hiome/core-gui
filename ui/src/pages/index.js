import { Link } from "gatsby"
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
    const client = connect(`ws://${window.location.host}:1884`)
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

  roomRow(room) {
    return (
      <Link key={room.id} to={`/rooms?id=${room.id}`} className={`room ${room.occupancy_count > 0 ? 'active' : ''}`}>
        <div style={{fontSize: `70px`, marginBottom: `40px`}}>{ room.occupancy_count }</div>
        { room.name }
      </Link>
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

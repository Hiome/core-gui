import { Link } from "gatsby"
import React, { Component } from 'react'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import "./settings.css"

class RoomsSettingsPage extends Component {
  state = {
    rooms: [],
  }

  async componentDidMount() {
    const json = await fetch(`${process.env.API_URL}api/1/rooms?include_hidden=true`).then(resp => resp.json())
    this.setState({rooms: json})
  }

  roomRow(room) {
    return (
      <Link key={room.id} to={`/settings/room?id=${room.id}`}
        className={`settingsRow ${room.hidden ? 'hidden' : ''}`}
        title={room.name}
      >{ room.name }</Link>
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
      <Layout goBack={true}>
        <SEO title="Manage Rooms" />
        <div className="headline">
          <h1>Manage Rooms</h1>
        </div>
        <div className="page">
          { this.renderRooms() }
        </div>
        <footer>&copy; Hiome Inc 2019</footer>
      </Layout>
    )
  }
}

export default RoomsSettingsPage

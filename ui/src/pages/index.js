import React, { Component } from 'react'

import Layout from "../components/layout"
import SEO from "../components/seo"

class IndexPage extends Component {
  state = {
    rooms: [],
  }

  async componentDidMount() {
    const json = await fetch(`${process.env.API_URL}api/1/rooms`).then(resp => resp.json())
    this.setState({rooms: json})
  }

  roomRow(room) {
    return (
      <div key={room.id } style={{fontWeight: `bold`, fontSize: `25px`, margin: `50px`}}>
        <div style={{fontSize: `50px`, marginBottom: `10px`}}>{ room.occupancy_count }</div>
        { room.name }
        <div style={{fontSize: `10px`, fontWeight: `normal`, color: `#999`}}>{ room.id }</div>
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
      return <p>Uh oh, no rooms found...</p>
    }
  }

  render() {
    return (
      <Layout>
        <SEO title="Rooms" />
        <h1 style={{textAlign: `center`}}>Rooms</h1>
        <div style={{margin: `0 auto`, textAlign: `center`}}>
          { this.renderRooms() }
        </div>
      </Layout>
    )
  }
}

export default IndexPage

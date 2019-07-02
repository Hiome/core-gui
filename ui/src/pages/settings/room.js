import React, { Component } from 'react'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import "./settings.css"

class RoomSettingsPage extends Component {
  state = {
    id: null,
    name: 'Loading...',
    occupancy_count: 0,
    doors: 0,
    hidden: false
  }

  async componentDidMount() {
    const params = (new URL(document.location)).searchParams
    const roomId = params.get('id')
    const json = await fetch(`${process.env.API_URL}api/1/rooms/${roomId}`).then(resp => resp.json())
    this.setState(json)
  }

  are() {
    return this.state.doors === 1 ? "is" : "are"
  }

  onchange = (e) => {
    fetch(`${process.env.API_URL}api/1/rooms/${this.state.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({hidden: !e.target.checked, occupancy_count: 0})
    }).then(resp => resp.json()).then(resp => this.setState({hidden: resp.hidden, occupancy_count: resp.occupancy_count}))
  }

  render() {
    return (
      <Layout goBack={true}>
        <SEO title={`Manage ${this.state.name}`} />
        <div className="headline">
          <h1>Manage { this.state.name }</h1>
          <p>
            There { this.are() } { this.state.doors } door{this.state.doors === 1 ? '' : 's'} configured in this room.
          </p>
        </div>
        <div className="page">
          <input type="checkbox" checked={!this.state.hidden} id="hidden" onChange={this.onchange} />
          <label className="hiddenInput" htmlFor="hidden">All doors in { this.state.name } have a Hiome Door sensor.</label>
          <p style={{color: '#848F96'}}>In order to have an accurate occupancy count for a room, you need a Hiome Door sensor on every door in the room. Check this box when that is true to display the room in Hiome.</p>
        </div>
        <footer>&copy; Hiome Inc 2019</footer>
      </Layout>
    )
  }
}

export default RoomSettingsPage

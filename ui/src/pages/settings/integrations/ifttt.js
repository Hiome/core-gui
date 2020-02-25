import { Result, Input } from "antd"
import React, { Component } from 'react'
import { connect } from 'mqtt/dist/mqtt'

import SettingsMenu from "../../../components/SettingsMenu"
import LayoutPage from "../../../components/LayoutPage"
import SEO from "../../../components/seo"

import IftttKey from "../../../components/Images/IftttKey"

class IftttSettingsPage extends Component {
  state = {
    token: null,
    rooms: [],
    doors: []
  }

  componentDidMount() {
    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => {
      client.subscribe('_hiome/integrate/ifttt', {qos: 1})
    })
    client.on('message', function(t, m, p) {
      if (m == null || this.state.token) return
      this.setState({token: m.toString()})
      client.end()
    }.bind(this))

    fetch(`${process.env.API_URL}api/1/rooms`).then(resp => resp.json()).then(resp => this.setState({rooms: resp}))
    fetch(`${process.env.API_URL}api/1/sensors?type=door`)
      .then(resp => resp.json())
      .then(resp => this.setState({doors: resp}))
  }

  saveToken = (e) => {
    if (e.target == null || e.target.value == null) return
    const t = e.target.value.trim()
    this.setState({token: t})
    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => client.publish('_hiome/integrate/ifttt', t, {retain: true}, () => client.end()))
  }

  start() {
    return <>
      <p>To find your key, go to <strong><a href="https://ifttt.com/maker_webhooks" target="_blank" rel="noopener noreferrer">https://ifttt.com/maker_webhooks</a></strong> (sign in if necessary) and click the <em>Documentation</em> button in the top right corner.</p>
      <IftttKey />
    </>
  }

  instructions() {
    return <Result
      status="success"
      title="Hiome is publishing events to IFTTT!"
    >
      <p>You can now connect Hiome to other services via the Webhooks trigger.</p>
      <ol>
        <li><a href="https://ifttt.com/create" target="_blank" rel="noopener noreferrer">Create a new IFTTT applet</a></li>
        <li>Click "+ This"</li>
        <li>Search for "webhooks" and choose the <b>Webhooks</b> service</li>
        <li>Choose the "Receive a web request" trigger</li>
        <li>Enter one of the event names below.</li>
        <li>Click "+ That"</li>
        <li>Connect your chosen event with any action you want!</li>
      </ol>

      <p>Hiome is publishing the following events to IFTTT for you:</p>

      {this.renderRoomEventNames()}

      <p><em>Doors</em></p>
      <ul>
        {this.renderDoorEventNames()}
      </ul>

    </Result>
  }

  sanitizeName(name) {
    return name.replace(/[^\w\s_]/g, "").trim().replace(/\s+/g, "_").toLowerCase()
  }

  renderRoomEventNames() {
    if (this.state.rooms.length === 0) return <p>Loading room names...</p>

    const arr = []
    for (let r of this.state.rooms) {
      const sr = this.sanitizeName(r.name)
      arr.push(<p><em>{r.name}</em></p>)
      arr.push(
        <ul>
          <li><strong>hiome_{sr}_occupied</strong> &#x2192; {r.name} is occupied</li>
          <li><strong>hiome_{sr}_empty</strong> &#x2192; {r.name} is empty</li>
          <li><strong>hiome_{sr}_countN</strong> &#x2192; {r.name}'s occupancy count is N (e.g., hiome_{sr}_count3)</li>
        </ul>
      )
    }

    return arr
  }

  renderDoorEventNames() {
    if (this.state.doors.length === 0) return <li>Loading door names...</li>

    const arr = []
    for (let d of this.state.doors) {
      const r1 = d.name.split(" <-> ")[0]
      const r2 = d.name.split(" <-> ")[1]
      const r1_san = this.sanitizeName(r1)
      const r2_san = this.sanitizeName(r2)
      arr.push(<li><strong>hiome_{r1_san}_{r2_san}_door_opened</strong> &#x2192; door from {r1} to {r2} is opened</li>)
      arr.push(<li><strong>hiome_{r1_san}_{r2_san}_door_closed</strong> &#x2192; door from {r1} to {r2} is closed</li>)
    }

    return arr
  }

  renderPage() {
    if (this.state.token === null || this.state.token === '') return this.start()
    return this.instructions()
  }

  renderTokenInput() {
    return <p>Your IFTTT key is: 
      <Input value={this.state.token} size="large" placeholder="Paste your IFTTT key here" onChange={this.saveToken}/>
    </p>
  }

  render() {
    return (
      <LayoutPage goBack={true}>
        <SEO title="Settings" />
        <h1>Settings</h1>
        <SettingsMenu page="ifttt" />

        {this.renderTokenInput()}
        {this.renderPage()}
      </LayoutPage>
    )
  }
}

export default IftttSettingsPage

import { Icon, Button, Result, Switch, Input } from "antd"
import React, { Component } from 'react'
import { connect } from 'mqtt/dist/mqtt'
import Img from 'gatsby-image'

import SettingsMenu from "../../../components/SettingsMenu"
import LayoutPage from "../../../components/LayoutPage"
import SEO from "../../../components/seo"

import IftttKey from "../../../components/Images/IftttKey"

class IftttSettingsPage extends Component {
  state = {
    token: null
  }

  componentDidMount() {
    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => {
      client.subscribe('_hiome/integrate/ifttt', {qos: 1})
    })
    client.on('message', function(t, m, p) {
      if (m == null || this.state.token) return
      this.setState({token: m.toString()})
    }.bind(this))
  }

  saveToken = (e) => {
    console.log(e)
    if (e.value === null) return
    const t = e.value.trim()
    if (t === '') return

    this.setState({token: t})
    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => client.publish('_hiome/integrate/ifttt', t, {retain: true}, () => client.end()))
  }

  start() {
    return <>
      <p>To find your IFTTT key, go to <a href="https://ifttt.com/maker_webhooks" target="_blank">https://ifttt.com/maker_webhooks</a> and click the Documentation button in the top right corner. Copy/paste your key here.
      <IftttKey />
    </>
  }

  instructions() {
    return <Result
      status="success"
      title="Hiome is publishing events to IFTTT!"
    >
      <p>You can now create an IFTTT applet to connect Hiome to your other devices.</p>
      <ol>
        <li>Go to https://ifttt.com/create</li>
        <li>Click "+ This"</li>
        <li>Search for "webhooks" and choose the <b>Webhooks</b> service</li>
        <li>Choose the "Receive a web request" trigger</li>
        <li>Enter one of the event names below.</li>
        <li>
      <p>When a room in Hiome is occupied{this.state.onlyControlAtNight ? ' after sunset' : ''}, all lights in the Hue room
          with the same name will be turned on. For example, if your Living Room is occupied, the "Living Room" group in Hue will be
          turned on. When the room is no longer occupied, all lights in the room will be turned off.</p>
      <p style={{whiteSpace: `pre-wrap`}}>
        <strong>Only turn on lights after sunset?</strong> {`  `}
          <Switch
              onChange={this.controlAtNightToggle}
              checked={this.state.onlyControlAtNight}
              checkedChildren="Yes"
              unCheckedChildren="No" />
      </p>
      <p>{this.state.onlyControlAtNight ? 'Your lights will only turn on after sunset.' : 'Your lights will be controlled all day.'}</p>
    </Result>
  }

  renderPage() {
    if (this.state.token === null) return this.start()
    return this.instructions()
  }

  render() {
    return (
      <LayoutPage goBack={true}>
        <SEO title="Settings" />
        <h1>Settings</h1>
        <SettingsMenu page="ifttt" />

        <p>Your IFTTT key is: <Input size="large" /></p>
        {this.renderPage()}
      </LayoutPage>
    )
  }
}

export default IftttSettingsPage

import { Link } from "gatsby"
import React, { Component } from 'react'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import "./settings.css"

class DevicesSettingsPage extends Component {
  state = {
    sensors: [],
  }

  async componentDidMount() {
    const json = await fetch(`${process.env.API_URL}api/1/sensors`).then(resp => resp.json())
    this.setState({sensors: json})
  }

  renderVersion(sensor) {
    if (sensor.version)
      return (
        <em>({ sensor.version })</em>
      )
  }

  renderText(sensor) {
    if (sensor.type === 'door') {
      return (
        <strong>{ sensor.name } { sensor.type }</strong> { this.renderVersion(sensor) } <Link to={`/sensors/add?id=${sensor.id}`}>Reconfigure</Link>
      )
    } else if (sensor.type === 'gateway') {
      return (
        <strong>Hiome Core gateway</strong> { this.renderVersion(sensor) }
      )
    } else {
      return (
        <strong>{ sensor.name } { sensor.type }</strong> { this.renderVersion(sensor) }
      )
    }
  }

  row(sensor) {
    return (
      <p key={sensor.id }>{ this.renderText(sensor) }</p>
    )
  }

  renderSensors() {
    if (this.state.sensors.length > 0) {
      const arr = []
      for (let s of this.state.sensors) {
        arr.push(this.row(s))
      }
      return arr
    } else {
      return <p>No sensors found.</p>
    }
  }

  render() {
    return (
      <Layout goBack={true}>
        <SEO title="Manage Devices" />
        <div className="headline">
          <h1>Manage Devices</h1>
        </div>
        <div className="page">
          { this.renderSensors() }
        </div>
        <footer>&copy; Hiome Inc 2019</footer>
      </Layout>
    )
  }
}

export default DevicesSettingsPage

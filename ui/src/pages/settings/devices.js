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

  renderDoorLink(sensor) {
    if (sensor.type === 'door')
      return (
        <Link to={`/sensors/add?id=${sensor.id}`}>Reconfigure</Link>
      )
  }

  renderVersion(sensor) {
    if (sensor.version)
      return (
        <em>({ sensor.version })</em>
      )
  }

  renderName(sensor) {
    return sensor.type === 'gateway' ? 'Hiome Core' : sensor.name
  }

  row(sensor) {
    return (
      <p key={sensor.id }>
        <strong>{ this.renderName(sensor) } { sensor.type }</strong> { this.renderVersion(sensor) } { this.renderDoorLink(sensor) }
      </p>
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

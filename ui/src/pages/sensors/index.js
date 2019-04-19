import React, { Component } from 'react'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

class SensorsPage extends Component {
  state = {
    sensors: [],
  }

  async componentDidMount() {
    const json = await fetch(`${process.env.API_URL}api/1/sensors`).then(resp => resp.json())
    this.setState({sensors: json})
  }

  row(sensor) {
    return (
      <li key={sensor.id }>
        { sensor.name } ({ sensor.id }) is in { sensor.room_id } with { sensor.battery || 'unknown' } volts of battery.
      </li>
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
      return <p>Uh oh, no sensors found...</p>
    }
  }

  render() {
    return (
      <Layout>
        <SEO title="Sensors" />
        <h1 style={{textAlign: `center`}}>Sensors</h1>
        <ul>
          { this.renderSensors() }
        </ul>
      </Layout>
    )
  }
}

export default SensorsPage

import { navigate, Link } from 'gatsby'
import { Button, Icon, Spin, Empty, message } from 'antd'
import React, { Component } from 'react'

import SettingsMenu from "../../components/SettingsMenu"
import Layout from "../../components/Layout"

import "../rooms.css"

class DoorIndexPage extends Component {
  state = {
    sensors: [],
    loading: true
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.justDeleted) {
      message.success(`${this.props.location.state.justDeleted} was successfully deleted.`)
      // clear justDeleted state so we don't keep seeing it
      let state = this.props.location.state
      delete state.justDeleted
      navigate(this.props.location.pathname, {state, replace: true})
    }

    this.setState({loading: true})
    fetch(`${process.env.API_URL}api/1/sensors?type=door`)
      .then(resp => resp.json())
      .then(resp => this.setState({sensors: resp, loading: false}))
  }

  renderDoor() {
    return (
      <svg width="52px" height="64px" viewBox="0 0 52 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g>
            <path d="M9,58 L0,58" id="Shape" stroke="#000000" strokeWidth="2"></path>
            <path d="M52,58 L36.1,58" id="Shape" stroke="#000000" strokeWidth="2"></path>
            <polyline id="Shape" stroke="#000000" strokeWidth="2" points="9 58 9 1 43 1 43 58"></polyline>
            <path d="M10,2.4 L35.1,6.7 L35.1,61.6 L10,57.3 L10,2.4 L10,2.4 Z M8,0 L8,59 L37.1,64 L37.1,5 L8,0 L8,0 Z" id="Shape" fill="#000000" fillRule="nonzero"></path>
            <ellipse id="Oval" stroke="#000000" strokeWidth="2" cx="29.7" cy="31.6" rx="1.8" ry="2"></ellipse>
          </g>
        </g>
      </svg>
    )
  }

  renderSensors() {
    if (this.state.loading) {
      return <Spin size="large" indicator={<Icon type="loading" />} style={{textAlign: `center`, display: `block`}} />
    } else if (this.state.sensors.length > 0) {
      return this.state.sensors.map(sensor => <Link to={`/settings/door/${sensor.id}`}
              className='room active' key={`sensor${sensor.id}`}
              title={sensor.name}>{ sensor.name }</Link>)
    } else {
      return (
        <Empty image={this.renderDoor()} imageStyle={{height: 80}} description={"No doors found."} />
      )
    }
  }

  render() {
    return (
      <Layout title="Settings">
        <SettingsMenu page="doors" />

        { this.renderSensors() }

        <div style={{textAlign: `center`, marginTop: `40px`}}>
          <Button type="primary" shape="round" icon="plus" size="large" onClick={() => navigate('/sensors/add')}>Add New Door</Button>
        </div>
      </Layout>
    )
  }
}

export default DoorIndexPage

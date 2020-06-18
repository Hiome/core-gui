import { navigate } from "gatsby"
import { Modal, Icon, Switch, Button, PageHeader, Tooltip, Spin, Empty, message } from "antd"
import React, { Component } from 'react'

import SettingsMenu from "../../components/SettingsMenu"
import Layout from "../../components/Layout"

const { confirm } = Modal

class RoomSettingsPage extends Component {
  state = {
    id: null,
    loading: true,
    name: 'Loading...',
    sensors: [],
    hidden: true
  }

  componentDidMount() {
    this.setState({loading: true})

    const params = (new URL(document.location)).searchParams
    const roomId = params.get('id')
    const f1 = fetch(`${process.env.API_URL}api/1/rooms/${roomId}`).then(resp => resp.json()).then(resp => this.setState(resp))

    const f2 = fetch(`${process.env.API_URL}api/1/rooms/${roomId}/doors`).then(resp => resp.json()).then(resp => {
      this.setState({sensors: resp})
      if (this.state.hidden === false && resp.length === 0) {
        this.onchange(true, null)
      }
    })

    Promise.all([f1, f2]).then(() => this.setState({loading: false}))
  }

  onchange = (checked, e) => {
    fetch(`${process.env.API_URL}api/1/rooms/${this.state.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({hidden: checked, occupancy_count: 0})
    }).then(() => this.setState({hidden: checked}))
  }

  deleteRoom = () => {
    confirm({
      title: `Are you sure you want to delete ${this.state.name}?`,
      content: 'This cannot be undone.',
      onOk: () => {
        fetch(`${process.env.API_URL}api/1/rooms/${this.state.id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(resp => navigate('/settings/rooms', {state: {justDeleted: this.state.name}}))
      },
      okText: 'Delete',
      okType: 'danger'
    })
  }

  rename = () => {
    const oldName = this.state.name
    const newName = prompt(`What do you want to rename ${this.state.name} to?`, oldName)
    if (newName && newName !== oldName) {
      fetch(`${process.env.API_URL}api/1/rooms/${this.state.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: newName.trim()})
      }).then(resp => {
        this.setState({name: newName})
        message.success(`${oldName} has been renamed to ${newName}.`)
      })
    }
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
      return <div style={{textAlign: 'center'}}><Spin size="large" indicator={<Icon type="loading" />} /></div>
    }
    else if (this.state.sensors.length > 0) {
      return <ul style={{marginLeft: '3em', marginTop: '1em'}}>{ this.state.sensors.map(sensor => <li key={`sensor${sensor.id}`}>{sensor.name}</li>) }</ul>
    } else {
      return (
        <Empty image={this.renderDoor()} imageStyle={{height: 80}} description={"No doors found."}>
          <Button type="danger" onClick={this.deleteRoom}>Delete {this.state.name}</Button>
        </Empty>
      )
    }
  }

  are() {
    return this.state.sensors.length === 1 ? "Is" : "Are"
  }

  renderHiddenDescription() {
    if (this.state.hidden) {
      return <p>
        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#f8ac30" /> No problem, I'll hide this room for now until all its doors have Hiome Door sensors.
      </p>
    } else {
      return <p>
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> Awesome, you're all set! This room is feeling smarter already.
      </p>
    }
  }

  renderHiddenToggle() {
    if (this.state.loading) return

    return (
      <div style={{marginTop: `40px`, marginLeft: `20px`}}>
        <div style={{fontWeight: `bold`, marginBottom: `15px`, whiteSpace: `pre-wrap`}}>
          {this.are()} there more than {this.state.sensors.length} door{this.state.sensors.length !== 1 ? 's' : ''} in {this.state.name}? {`  `}
          <Switch
            onChange={this.onchange}
            checked={this.state.hidden}
            disabled={this.state.sensors.length === 0}
            checkedChildren="Yes"
            unCheckedChildren="No" />
        </div>

        {this.renderHiddenDescription()}
      </div>
    )
  }

  renderOptions() {
    if (this.state.loading || this.state.sensors.length === 0) return

    return (
      <div style={{marginTop: `30px`}}>
        <Button type="link" onClick={this.rename}><Icon type="edit" /> Rename {this.state.name}</Button><br/>
        <Tooltip title={`You must delete all doors in ${this.state.name} first.`}>
          <Button type="link" disabled><Icon type="delete" /> Delete {this.state.name}</Button>
        </Tooltip>
      </div>
    )
  }

  render() {
    return (
      <Layout title="Settings">
        <SettingsMenu page="rooms" />

        <PageHeader title={this.state.name} onBack={() => navigate("/settings/rooms")}
          subTitle={this.state.sensors.length > 0 ? `has ${this.state.sensors.length} door${this.state.sensors.length !== 1 ? 's' : ''}.` : ``} />

        { this.renderSensors() }

        { this.renderHiddenToggle() }

        { this.renderOptions() }
      </Layout>
    )
  }
}

export default RoomSettingsPage

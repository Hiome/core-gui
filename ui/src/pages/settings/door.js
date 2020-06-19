import { navigate } from 'gatsby'
import { Button, Icon, Input, Spin, PageHeader, message, Modal } from "antd"
import React, { Component } from 'react'

import SensitivitySlider from "../../components/SensitivitySlider"
import SettingsMenu from "../../components/SettingsMenu"
import Layout from "../../components/Layout"
import HomeStream from "../../components/homestream"

const { confirm } = Modal

class DevicesSettingsPage extends Component {
  state = {
    sensor: {},
    loading: true
  }

  sensorId() {
    return this.props.location.pathname.split("/").filter(x => x).pop()
  }

  componentDidMount() {
    this.setState({loading: true})
    const sId = this.sensorId()
    fetch(`${process.env.API_URL}api/1/sensors/${sId}`)
      .then(resp => resp.json())
      .then(resp => this.setState({sensor: resp, loading: false}))

    HomeStream.subscribe(`hs/1/com.hiome/${sId}/+`, function(m) {
      this.setState((prevState, props) => {
        const sensor = prevState.sensor
        sensor[m.attribute] = m.val
        return ({sensor})
      })
    }.bind(this))
  }

  deleteSensor = (sensorId, sensorName) => {
    confirm({
      title: `Are you sure you want to delete this door?`,
      content: 'This cannot be undone.',
      onOk: () => {
        fetch(`${process.env.API_URL}api/1/sensors/${sensorId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(resp => navigate('/settings', {state: {justDeleted: sensorName}}))
      },
      okText: 'Delete',
      okType: 'danger'
    })

    return false
  }

  saveName = (v, e) => {
    if (!v) return false
    v = v.trim()
    if (v.length === 0) return false
    HomeStream.write(`com.hiome/gui/to/com.hiome/${this.state.sensor.id}/name`, {val: v})
    message.success(`Updated sensor name to ${v}`)
  }

  renderContent() {
    return (<>
      <p style={{marginTop: '10px'}}><strong>Name</strong></p>
      <p>
        <Input.Search placeholder="Name of door" defaultValue={this.state.sensor.name} allowClear={false}
          enterButton="Save" onSearch={this.saveName} />
      </p>
      <SensitivitySlider sensorId={this.state.sensor.id} value={this.state.sensor.sensitivity == null ? 0.9 : this.state.sensor.sensitivity} />
      <p style={{marginTop: '10px'}}><strong>Firmware Version</strong></p>
      <p>{this.state.sensor.version || 'Unknown'}</p>
      <p style={{paddingTop: '20px'}}>
        <Button type="danger" icon="delete" onClick={() => this.deleteSensor(this.state.sensor.id, this.state.sensor.name)}>Delete {this.state.sensor.name}</Button>
      </p>
    </>)
  }

  render() {
    return (
      <Layout title="Settings">
        <SettingsMenu page="doors" />
        <PageHeader title={this.state.sensor.name} onBack={() => navigate('/settings')}
          subTitle={['open', 'ajar', 'closed'].indexOf(this.state.sensor.data) !== -1 ? `is ${this.state.sensor.data}.` : ''} />
        { this.state.loading ? <Spin size="large" indicator={<Icon type="loading" />} style={{textAlign: `center`, display: `block`}} /> : this.renderContent() }
      </Layout>
    )
  }
}

export default DevicesSettingsPage

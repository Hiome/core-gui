import { navigate } from 'gatsby'
import { Button, Icon, Card, Divider, List, Empty, message, Modal } from "antd"
import React, { Component } from 'react'

import SettingsMenu from "../../components/SettingsMenu"
import LayoutPage from "../../components/LayoutPage"
import SEO from "../../components/seo"

const { confirm } = Modal

class DevicesSettingsPage extends Component {
  state = {
    sensors: [],
    loading: true
  }

  componentDidMount() {
    this.setState({loading: true})
    fetch(`${process.env.API_URL}api/1/sensors?type=door`)
      .then(resp => resp.json())
      .then(resp => this.setState({sensors: resp, loading: false}))
  }

  renderVersion(sensor) {
    if (sensor.version)
      return (
        <em style={{fontSize: `0.8em`, marginRight: `10px`}}>{ sensor.version }</em>
      )
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

  deleteSensor = (sensorId, sensorName, e) => {
    e.preventDefault()

    confirm({
      title: `Are you sure you want to delete the ${sensorName} door?`,
      content: 'This cannot be undone.',
      onOk: () => {
        fetch(`${process.env.API_URL}api/1/sensors/${sensorId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(resp => resp.json()).then(resp => {
          this.componentDidMount()
          message.success(`${resp.name} was successfully deleted.`)
        })
      },
      okText: 'Delete',
      okType: 'danger'
    })

    return false
  }

  renderSensors() {
    if (this.state.loading || this.state.sensors.length > 0) {
      return (
        <List
          dataSource={this.state.sensors}
          rowKey={item => `sensor${item.id}`}
          loading={this.state.loading}
          grid={{
            gutter: 25,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          renderItem={sensor => <List.Item>
                <Card style={{textAlign: `center`, minWidth: `200px`}} actions={[
                  // eslint-disable-next-line
                  <a href="#" onClick={(e) => this.deleteSensor(sensor.id, sensor.name, e)}><Icon type="delete" /> Delete</a>
                ]}>
                  <div style={{
                    textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap`
                  }}>
                    {sensor.name.split(" <-> ")[0]}
                    <Divider style={{margin: `10px 0`}}><Icon type="swap" rotate={90}/></Divider>
                    {sensor.name.split(" <-> ")[1]}
                  </div>
                </Card>
              </List.Item>
          }
        />
      )
    } else {
      return (
        <Empty image={this.renderDoor()} imageStyle={{height: 80}} description={"No doors found."} />
      )
    }
  }

  render() {
    return (
      <LayoutPage goBack={true}>
        <SEO title="Settings" />
        <h1>Settings</h1>
        <SettingsMenu page="doors" />

        { this.renderSensors() }
        <div style={{textAlign: `center`, marginTop: `40px`}}>
          <Button type="primary" shape="round" icon="plus" size="large" onClick={() => navigate('/sensors/add')}>Add New Door</Button>
        </div>
      </LayoutPage>
    )
  }
}

export default DevicesSettingsPage

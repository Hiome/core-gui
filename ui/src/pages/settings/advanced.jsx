import { Button, Divider, Modal, Alert } from "antd"
import React, { Component } from 'react'
import { connect } from 'mqtt/dist/mqtt'

import SettingsMenu from "../../components/SettingsMenu"
import LayoutPage from "../../components/LayoutPage"
import SEO from "../../components/seo"

const { confirm } = Modal

class AdancedSettingsPage extends Component {
  disconnectHomekit = () => {
    confirm({
      title: `Are you sure you want to reset HomeKit?`,
      content: "This will force Hiome Core to forget your HomeKit setup. You should remove Hiome from HomeKit first.",
      onOk: () => {
        const client = connect(`ws://${window.location.host}:1884`)
        client.on('connect', () => client.publish(
          'hiome/1/api', `{"val": "homekitReset", "type": "core", "ts": ${Date.now() / 1000 | 0}}`, () => client.end()))
      },
      okText: 'Reset',
      okType: 'danger'
    })
  }

  disconnectHue = () => {
    confirm({
      title: `Are you sure you want to reset Hue?`,
      content: "This will force Hiome Core to forget your Philips Hue token.",
      onOk: () => {
        const client = connect(`ws://${window.location.host}:1884`)
        client.on('connect', () => client.publish(
          'hiome/1/api', `{"val": "hueReset", "type": "core", "ts": ${Date.now() / 1000 | 0}}`, () => client.end()))
      },
      okText: 'Reset',
      okType: 'danger'
    })
  }

  factoryReset = () => {
    confirm({
      title: `Are you sure you want to factory reset Hiome Core?`,
      content: "This will delete all of your data and reset everything. This cannot be undone!",
      onOk: () => {
        const client = connect(`ws://${window.location.host}:1884`)
        client.on('connect', () => client.publish(
          'hiome/1/api', `{"val": "factoryReset", "type": "core", "ts": ${Date.now() / 1000 | 0}}`, () => client.end()))
      },
      okText: 'Reset',
      okType: 'danger'
    })
  }

  updateSensors = () => {
    confirm({
      title: `Are you sure you want to update firmware right now?`,
      content: "This will cause Hiome to stop working while it updates each sensor. This generally takes about 1 minute per sensor.",
      onOk: () => {
        const client = connect(`ws://${window.location.host}:1884`)
        client.on('connect', () => client.publish(
          'hiome/1/api', `{"val": "updateFirmware", "type": "core", "ts": ${Date.now() / 1000 | 0}}`, () => client.end()))
      },
      okText: 'Update',
      okType: 'primary'
    })
  }

  render() {
    return (
      <LayoutPage goBack={true}>
        <SEO title="Settings" />
        <h1>Settings</h1>
        <SettingsMenu page="advanced" />

        <Alert message="Advanced Settings" description="These settings can cause permanent data loss. You should not mess with them unless directed by support!" type="warning" showIcon />

        <Divider />
        <p>
        Force your sensors to update their firmware immediately.
        <br/><br/>
        <Button onClick={this.updateSensors} key="updateFirmware">Update Sensor Firmware</Button>
        </p>

        <Divider />
        <p>
        Delete cached Philips Hue configuration. This will require you to pair Hiome with your Hue Bridge again.
        <br/><br/>
        <Button type="danger" onClick={this.disconnectHue} key="resetHomekit">Reset Hue</Button>
        </p>

        <Divider />
        <p>
        Delete cached HomeKit configuration. Only use this if you're having issues re-adding Hiome to HomeKit.
        <br/><br/>
        <Button type="danger" onClick={this.disconnectHomekit} key="resetHomekit">Reset HomeKit</Button>
        </p>

        <Divider />
        <p>
        Reset Hiome Core back to factory default. <strong>This will permanently delete all your data!</strong>
        <br/><br/>
        <Button type="danger" onClick={this.factoryReset} key="resetHomekit">Factory Reset</Button>
        </p>
      </LayoutPage>
    )
  }
}

export default AdancedSettingsPage

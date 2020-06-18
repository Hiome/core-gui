import { Button, Divider, Modal } from "antd"
import React, { PureComponent } from 'react'
import { connect } from 'mqtt/dist/mqtt'

import SettingsMenu from "../../../components/SettingsMenu"
import Layout from "../../../components/Layout"

const { confirm } = Modal

class HomekitSettingsPage extends PureComponent {
  disconnectHomekit = () => {
    confirm({
      title: `Are you sure you want to reset HomeKit?`,
      content: "This will force Hiome Core to forget your HomeKit setup. You should remove Hiome from HomeKit first. Only proceed if you're having issues with HomeKit!",
      onOk: () => {
        const client = connect(`ws://${window.location.host}:1884`)
        client.on('connect', () => client.publish(
          'hiome/1/api', `{"val": "homekitReset", "type": "core", "ts": ${Date.now() / 1000 | 0}}`, () => client.end()))
      },
      okText: 'Reset',
      okType: 'danger'
    })
  }

  render() {
    return (
      <Layout title="Settings">
        <SettingsMenu page="homekit" />

        <p>To add Hiome to HomeKit, follow these steps:</p>
        <ol>
          <li>Open the iOS Home app, tap the + button, and then "Add Accessory"</li>
          <li>Tap "I Don't Have a Code or Cannot Scan"</li>
          <li>Select the Hiome bridge</li>
          <li>Tap "Add Anyway" to the uncertified accessory warning</li>
          <li>Enter your HomeKit setup code: <strong>102-71-990</strong></li>
        </ol>
        <p>You should now see your Hiome sensors in your HomeKit!</p>
        <Divider />
        <Button type="danger" onClick={this.disconnectHomekit} key="disconnect">Reset HomeKit Connection</Button>
      </Layout>
    )
  }
}

export default HomekitSettingsPage

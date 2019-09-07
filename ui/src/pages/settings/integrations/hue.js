import { Link, navigate } from "gatsby"
import { Icon, Button, Result, message } from "antd"
import React, { Component } from 'react'

import SettingsMenu from "../../../components/SettingsMenu"
import LayoutPage from "../../../components/LayoutPage"
import SEO from "../../../components/seo"

class HueSettingsPage extends Component {
  state = {
    status: "scanning"
  }

  componentDidMount() {
    this.scanForBridge()
  }

  scanForBridge = () => {
    this.setState({status: 'scanning'})
    fetch(`${process.env.API_URL}api/1/hue/search`)
      .then(resp => resp.status === 200 ? this.setState({status: resp}) : this.setState({status: 'fail'}))
      .catch(error => this.setState({status: 'fail'}))
  }

  renderHueButton() {
    return null
  }

  fail() {
    return <Result
      status="error"
      title="Something Went Wrong"
      subTitle="Hiome was unable to connect to Philips Hue."
      extra={[
        <Button onClick={() => window.dispatchEvent(new Event("helpMe"))}>Contact Support</Button>,
        <Button onClick={this.scanForBridge} type="primary">Try Again</Button>
      ]}
    />
  }

  noBridgesFound() {
    return <Result
      status="warning"
      title="No Philips Hue Bridge Found"
      subTitle="Make sure your Hue Bridge is on the same network as Hiome Core."
      extra={[
        <Button onClick={() => window.dispatchEvent(new Event("helpMe"))}>Contact Support</Button>,
        <Button onClick={this.scanForBridge} type="primary">Try Again</Button>
      ]}
    />
  }

  noLinkPushed() {
    return <Result
      icon={this.renderHueButton()}
      title="Link Button Not Pushed"
      subTitle="Push the link button on your Hue Bridge and try again."
      extra={[
        <Button onClick={this.scanForBridge} type="primary">Try Again</Button>
      ]}
    />
  }

  scanning() {
    return <Result
        icon={this.renderHueButton()}
        title="Push the Link button on your Hue hub to connect with Hiome"
        subTitle={<p><Icon type="loading" /> &nbsp; Searching for Hue hub...</p>}
      />
  }

  connected() {
    return <Result
      status="success"
      title="Hiome is connected to Philips Hue!"
      subTitle="Add tips on how to build your scenes below"
    />
  }

  renderPage() {
    if (this.state.status === 'scanning') return this.scanning()
    else if (this.state.status === 'connected') return this.connected()
    else if (this.state.status === 'no_bridges_found') return this.noBridgesFound()
    else if (this.state.status === 'no_link_pushed') return this.noLinkPushed()
    else if (this.state.status === 'fail') return this.fail()
  }

  render() {
    return (
      <LayoutPage goBack={true}>
        <SEO title="Settings" />
        <h1>Settings</h1>
        <SettingsMenu page="hue" />

        {this.renderPage()}
      </LayoutPage>
    )
  }
}

export default HueSettingsPage

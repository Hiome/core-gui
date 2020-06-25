import { Icon, Button, Result, Switch } from "antd"
import React, { PureComponent } from 'react'

import SettingsMenu from "../../../components/SettingsMenu"
import Layout from "../../../components/Layout"
import HomeStream from "../../../components/homestream"

class HueSettingsPage extends PureComponent {
  state = {
    status: "start",
    onlyControlAtNight: true
  }

  componentDidMount() {
    HomeStream.subscribe('hs/1/com.hiome/hue/+', function(m) {
      if (m.attribute === 'night_only') {
        this.setState({onlyControlAtNight: m.val})
      } else if (m.attribute === 'connected') {
        this.setState({status: m.val})
        if (m.val === 'no_link_pushed') {
          // try again in 20 seconds
          setTimeout(() => { HomeStream.write('com.hiome/gui/to/com.hiome/hue/scan', true) }, 20000)
        }
      }
    }.bind(this))
  }

  scanForBridge = () => {
    this.setState({status: 'start'})
    HomeStream.write('com.hiome/gui/to/com.hiome/hue/scan', true)
  }

  disconnectHue = () => {
    this.setState({status: 'start'})
    HomeStream.write('com.hiome/gui/to/com.hiome/hue/scan', false)
    setTimeout(() => { HomeStream.write('com.hiome/gui/to/com.hiome/hue/scan', true) }, 1000)
  }

  controlAtNightToggle = (checked, e) => {
    this.setState({onlyControlAtNight: checked})
    HomeStream.write('com.hiome/hue/night_only', checked, {retain: true})
  }

  renderHueButton() {
    return <svg width="78px" height="74px" viewBox="0 0 39 37" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g fillRule="nonzero">
                <g fill="#4990E2">
                    <path d="M28,2.16300593 L4,2.16300593 C2.9,2.16300593 2,3.05862595 2,4.15327265 L2,28.0194666 C2,29.1141133 2.9,30.0097333 4,30.0097333 L28,30.0097333 C29.1,30.0097333 30,29.1141133 30,28.0194666 L30,4.15327265 C30,3.05862595 29.1,2.16300593 28,2.16300593 Z M4,0 L28,0 C30.21,0 32,1.78128871 32,3.98053343 L32,28.0194666 C32,30.2187113 30.21,32 28,32 L4,32 C1.79,32 0,30.2187113 0,28.0194666 L0,3.98053343 C0,1.78128871 1.79,0 4,0 Z M16,22.75 C12.2720779,22.75 9.25,19.7279221 9.25,16 C9.25,12.2720779 12.2720779,9.25 16,9.25 C19.7279221,9.25 22.75,12.2720779 22.75,16 C22.75,19.7279221 19.7279221,22.75 16,22.75 Z M16,21.25 C18.8994949,21.25 21.25,18.8994949 21.25,16 C21.25,13.1005051 18.8994949,10.75 16,10.75 C13.1005051,10.75 10.75,13.1005051 10.75,16 C10.75,18.8994949 13.1005051,21.25 16,21.25 Z M9.5,7 C8.94771525,7 8.5,6.55228475 8.5,6 C8.5,5.44771525 8.94771525,5 9.5,5 C10.0522847,5 10.5,5.44771525 10.5,6 C10.5,6.55228475 10.0522847,7 9.5,7 Z M16,7 C15.4477153,7 15,6.55228475 15,6 C15,5.44771525 15.4477153,5 16,5 C16.5522847,5 17,5.44771525 17,6 C17,6.55228475 16.5522847,7 16,7 Z M22.5,7 C21.9477153,7 21.5,6.55228475 21.5,6 C21.5,5.44771525 21.9477153,5 22.5,5 C23.0522847,5 23.5,5.44771525 23.5,6 C23.5,6.55228475 23.0522847,7 22.5,7 Z" id="Shape"></path>
                </g>
                <g transform="translate(25.049963, 25.208721) rotate(-34.000000) translate(-25.049963, -25.208721) translate(14.549963, 11.708721)" stroke="#000000" fill="#FFFFFF">
                    <path d="M17.3860309,10.3492743 L17.3860309,8.90823286 C17.3821463,7.93619786 16.6068874,7.15029831 15.6518977,7.15029831 C14.6969081,7.15029831 13.9216491,7.93619786 13.9177645,8.90823286 L13.9177645,7.46534571 C13.9174111,6.56591382 13.2526624,5.81059723 12.3743708,5.71167406 C11.4960791,5.6127509 10.6851722,6.20186241 10.4916312,7.07945571 L10.4916312,1.95806 C10.4877828,0.985998692 9.71251309,0.20005841 8.75749773,0.20005841 C7.80248238,0.20005841 7.02721269,0.985998692 7.02336427,1.95806 L7.02336427,14.9040357 L3.69216427,11.1462971 C3.00611793,10.3721325 1.8438986,10.2822521 1.05081518,10.9420281 C0.257731752,11.6018041 0.112946146,12.7789982 0.721764267,13.61741 L8.14203093,23.8395186 C9.94970491,26.3297864 13.1234576,27.3579924 16.0127302,26.3894022 C18.9020028,25.420812 20.8542996,22.6741662 20.8542987,19.5779 L20.8542987,10.3492743 C20.8505051,9.37717305 20.0752192,8.59117093 19.1201648,8.59117093 C18.1651104,8.59117093 17.3898245,9.37717305 17.3860309,10.3492743 L17.3860309,10.3492743 Z" id="Shape"></path>
                </g>
            </g>
        </g>
    </svg>
  }

  fail() {
    return <Result
      status="error"
      title="Something Went Wrong"
      subTitle="Hiome was unable to connect to Philips Hue."
      extra={[
        <Button onClick={() => window.dispatchEvent(new Event("helpMe"))} key="contact_us">Contact Support</Button>,
        <Button onClick={this.scanForBridge} type="primary" key="try_again">Try Again</Button>
      ]}
    />
  }

  noBridgesFound() {
    return <Result
      status="warning"
      title="No Philips Hue Bridge Found"
      subTitle="Make sure your Hue Bridge is on the same network as Hiome Core."
      extra={[
        <Button onClick={() => window.dispatchEvent(new Event("helpMe"))} key="contact_us">Contact Support</Button>,
        <Button onClick={this.scanForBridge} type="primary" key="try_again">Try Again</Button>
      ]}
    />
  }

  renderLoadingText() {
    if (this.state.status === 'no_link_pushed')
      return 'Hue Bridge found, waiting for Link button'
    else
      return 'Searching for Hue Bridge'
  }

  start() {
    return <>
      <Result
        icon={this.renderHueButton()}
        title="Connect Philips Hue with Hiome Core"
        subTitle="Push the Link button on your Hue Bridge to control your lights based on occupancy."
        extra={[
          <p key="loading"><Icon type="loading" /> &nbsp; {this.renderLoadingText()}</p>
        ]} />
    </>
  }

  connected() {
    return <Result
      status="success"
      title="Hiome is connected to Philips Hue!"
      extra={[
        <Button type="danger" onClick={this.disconnectHue} key="disconnect">Disconnect from Hue Bridge</Button>
      ]}
    >
      <p><strong>Create rooms in the Hue app with the same names as your Hiome rooms.</strong></p>
      <p>When a room in Hiome is occupied{this.state.onlyControlAtNight ? ' after sunset' : ''}, all lights in the Hue room
          with the same name will be turned on. For example, if your Living Room is occupied, the "Living Room" group in Hue will be
          turned on. When the room is no longer occupied, all lights in the room will be turned off.</p>
      <p style={{whiteSpace: `pre-wrap`}}>
        <strong>Only turn on lights after sunset?</strong> {`  `}
          <Switch
              onChange={this.controlAtNightToggle}
              checked={this.state.onlyControlAtNight}
              checkedChildren="Yes"
              unCheckedChildren="No" />
      </p>
      <p>{this.state.onlyControlAtNight ? 'Your lights will only turn on after sunset.' : 'Your lights will be controlled all day.'}</p>
    </Result>
  }

  renderPage() {
    if (this.state.status === 'start' || this.state.status === 'no_link_pushed') return this.start()
    else if (this.state.status === 'connected') return this.connected()
    else if (this.state.status === 'no_bridges_found') return this.noBridgesFound()
    else if (this.state.status === 'fail') return this.fail()
  }

  render() {
    return (
      <Layout title="Settings">
        <SettingsMenu page="hue" />

        {this.renderPage()}
      </Layout>
    )
  }
}

export default HueSettingsPage

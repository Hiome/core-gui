import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { connect } from 'mqtt/dist/mqtt'
import { Button } from 'antd'

import LayoutPage from "../../components/LayoutPage"
import SEO from "../../components/seo"
import LogViewer from "../../components/LogViewer"

class IndexPage extends Component {
  state = {
    id: null,
    name: 'this room',
    occupancy_count: 0
  }

  topic() {
    const params = new URLSearchParams(this.props.location.search)
    const roomId = params.get('id')
    return `com.hiome/${roomId}/~~`
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    const roomId = params.get('id')
    fetch(`${process.env.API_URL}api/1/rooms/${roomId}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({...resp})
      })

    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => {
      client.subscribe(`hiome/1/sensor/${roomId}:occupancy`, {qos: 1})
    })
    client.on('message', function(t, m, p) {
      if (m == null) return
      const message = JSON.parse(m.toString())
      if (message['meta'] && message['meta']['type'] === 'occupancy' && message['meta']['source'] === 'gateway') {
        this.setState({occupancy_count: message['val']})
      }
    }.bind(this))
  }

  setOcc = () => {
    let count = this.state.occupancy_count - 1
    if (count < 0) count = 1
    count = prompt(`How many people are in ${this.state.name}?`, count)
    count = parseInt(count)
    if (isNaN(count) || count < 0) return
    if (count > 100) count = 100

    fetch(`${process.env.API_URL}api/1/rooms/${this.state.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({occupancy_count: count})
    }).then(resp => this.setState({occupancy_count: count}))
  }

  headline() {
    return (<>
      <h1 style={{color: `#fff`, fontSize: `5em`, padding: `20px`, fontWeight: `100`}}>
        <span style={{fontWeight: `400`}}>{ this.state.occupancy_count }</span> {this.state.occupancy_count === 1 ? 'person' : 'people'} {this.state.occupancy_count === 1 ? 'is' : 'are'} in <span style={{fontWeight: `400`}}>{ this.state.name }</span>.
      </h1>
      <div style={{textAlign: `center`, margin: `1em auto 5em auto`}}>
        <Button icon="edit" shape="circle" ghost onClick={this.setOcc} />
        <Button icon="setting" shape="circle" ghost
          onClick={() => navigate(`/settings/room?id=${this.state.id}`)} style={{marginLeft: `20px`}} />
      </div>
    </>)
  }

  render() {
    return (
      <LayoutPage goBack={true} headline={this.headline()}>
        <SEO title={this.state.name} />
        <LogViewer topic={this.topic()} day={new Date().setHours(0,0,0,0)} />
      </LayoutPage>
    )
  }
}

export default IndexPage

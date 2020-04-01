import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from 'mqtt/dist/mqtt'
import { Button, Empty, Icon, Spin, Timeline } from 'antd'

import TimeAgo from "./TimeAgo"
import strftime from "./strftime"

class LogViewer extends Component {
  state = {
    page: 0,
    history: [],
    loading: true,
    disableLoadmore: true
  }

  componentDidMount() {
    if (this.props.endpoint)
      this.loadHistory()

    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => {
      client.subscribe('hiome/1/log', {qos: 1})
    })
    client.on('message', function(t, m, p) {
      if (m == null || this.props.endpoint == null) return
      const message = JSON.parse(m.toString())

      // only live update info/warning messages meant for users
      if (!this.props.debug && ['info', 'warning'].indexOf(message['level']) === -1) return

      // if viewing a specific device/room, only update for messages from that device
      const endpointParts = this.props.endpoint.split('/')
      if (endpointParts.length > 4 && (message['device_type'] !== endpointParts[3] ||
            message['device_id'] !== endpointParts[4])) {
        return
      }

      // add to timeline
      const h = {
        id: new Date().getTime(), // temporary log id
        event_type: message['val'],
        object_type: message['device_type'],
        object_id: message['device_id'],
        message: message['message'],
        level: message['level'],
        occurred_at: new Date(message['ts'])
      }
      const history = this.state.history
      history.unshift(h)
      this.setState({history})
    }.bind(this))
  }

  componentDidUpdate(prevProps) {
    if (this.props.endpoint !== prevProps.endpoint) {
      if (this.state.history.length > 0) this.setState({history: [], page: 0})
      this.loadHistory()
    }
  }

  loadHistory = () => {
    this.setState({loading: true})
    const pageSize = 50
    const page = this.state.page
    const history = this.state.history
    fetch(`${process.env.API_URL}${this.props.endpoint}?size=${pageSize}&page=${page}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({history: history.concat(resp), page: page+1, disableLoadmore: resp.length < pageSize, loading: false})
      })
  }

  dotColor(level) {
    if (level === 'debug') return 'gray'
    else if (level === 'info') return 'blue'
    else if (level === 'data') return 'green'
    return 'red'
  }

  showDebugInfo(history) {
    if (history.level === 'debug' || history.level === 'data') {
      return `[${history.object_id}/${history.event_type}] `
    }
  }

  historyRow(history) {
    return (
      <Timeline.Item key={history.id} color={this.dotColor(history.level)} style={{clear: `both`}}>
        <div className="timeago" style={{
          display: `inline-block`,
          width: this.props.debug ? `7.5rem` : `4.5rem`,
          fontSize: `0.8rem`,
          color: `#ccc`
        }}><TimeAgo time={history.occurred_at} debug={this.props.debug} /></div>
        <div style={{
          display: `inline-block`,
          color: history.level === 'debug' || history.level === 'data' ? '#aaa' : `inherit`
        }}>{this.showDebugInfo(history)}{ history.message }</div>
      </Timeline.Item>
    )
  }

  renderHistory() {
    if (this.state.history.length > 0) {
      const arr = []
      let lastDate = null
      for (let h of this.state.history) {
        const formattedD = strftime('%A, %B %e%t', new Date(h.occurred_at))
        if (formattedD !== lastDate) {
          lastDate = formattedD
          arr.push(
            <Timeline.Item key={formattedD}
              dot={<Icon type="clock-circle-o" style={{ fontSize: '20px', fontWeight: `bold`, color: `#000` }} />}>
              <span style={{marginLeft: `5px`, fontSize: '16px', fontWeight: `bold`, lineHeight: `20px`}}>{ formattedD }</span>
            </Timeline.Item>
          )
        }
        arr.push(this.historyRow(h))
      }
      return arr
    } else if (this.state.loading) {
      return <div style={{textAlign: `center`}}><Spin size="large" /></div>
    } else {
      return <Empty description="No history yet. Walk through a door!" />
    }
  }

  renderLoadMore() {
    if (this.state.disableLoadmore) return
    return <Button icon="reload" onClick={this.loadHistory} type="primary" loading={this.state.loading}>Load More</Button>
  }

  render() {
    return (<>
        <Timeline>
          { this.renderHistory() }
        </Timeline>
        { this.renderLoadMore() }
      </>
    )
  }
}

LogViewer.propTypes = {
  endpoint: PropTypes.string,
  debug: PropTypes.bool
}

LogViewer.defaultProps = {
  endpoint: null,
  debug: false
}

export default LogViewer

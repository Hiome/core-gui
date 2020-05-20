import React, { Component } from "react"
import { Button, Empty, Icon, Spin, Timeline } from 'antd'

import HomeStream from './homestream'
import TimeAgo from "./TimeAgo"
import strftime from "./strftime"

class LogViewer extends Component {
  state = {
    history: [],
    objects: {},
    loading: true,
    disableLoadmore: true,
  }

  componentDidMount() {
    this.loadHistory()

    const urlParams = new URLSearchParams(window.location.search)
    const topic = urlParams.get('t') || '~/~/~~'
    HomeStream.subscribe('hs/1/' + topic.replace('~~', '#').replace('~','+'), function(m) {
      const history = this.state.history
      history.unshift(m)
      const objects = this.state.objects
      if (m.attribute !== 'to') {
        let o = objects[m.namespace + '/' + m.object_id]
        if (o === undefined) o = {}
        o[m.attribute] = m.val
        objects[m.namespace + '/' + m.object_id] = o
      }
      this.setState({history, objects})
    }.bind(this))
  }

  loadHistory = () => {
    this.setState({loading: true})
    const history = this.state.history
    const urlParams = new URLSearchParams(window.location.search)
    const topic = urlParams.get('t') || '~/~/~~'
    const start = urlParams.get('s') || new Date().setHours(0,0,0,0)
    const end = history.length > 0 ? (history[-1]['ts'] - 1) : (start + 86399999)
    HomeStream.read('hs/1/' + topic.replace('~~', '#').replace('~','+'), start, {until: end, limit: 1000, reverse: true}, function(resp) {
      const objects = this.state.objects
      for (let h of resp) {
        if (h.attribute !== 'to') {
          let o = objects[h.namespace + '/' + h.object_id]
          if (o === undefined) o = {}
          // we are parsing in reverse chronological order. If we saw this attribute earlier, that was the more recent value
          if (o[h.attribute] === undefined) {
            o[h.attribute] = h.val
            objects[h.namespace + '/' + h.object_id] = o
          }
        }
      }
      this.setState({history: history.concat(resp), objects: objects, disableLoadmore: resp.length < 1000, loading: false})
    }.bind(this))
  }

  showDebugInfo(history) {
    if (history.level === 'debug' || history.level === 'data') {
      return `[${history.object_id}/${history.event_type}] `
    }
  }

  historyRow(history, debug) {
    const o = this.state.objects[history.namespace + '/' + history.object_id] || {}
    if (!debug && o.name === undefined) return
    if (history.attribute === 'name') return
    const payload = JSON.parse(history.payload)
    return (
      <Timeline.Item key={history.ts} color='blue' style={{clear: `both`}}>
        <div className="timeago" style={{
          display: `inline-block`,
          width: this.props.debug ? `7.5rem` : `4.5rem`,
          fontSize: `0.8rem`,
          color: `#ccc`
        }}><TimeAgo time={history.ts} debug={debug} /></div>
        <div style={{display: `inline-block`}}>
          { o.name || history.topic }: { history.attribute } is { payload['val'] }
        </div>
      </Timeline.Item>
    )
  }

  renderHistory() {
    if (this.state.history.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const start = urlParams.get('s') || new Date().setHours(0,0,0,0)
      const debug = urlParams.get('debug') === 'true'
      const formattedD = strftime('%A, %B %e%t', new Date(h.ts))
      const arr = [
        <Timeline.Item key={formattedD}
          dot={<Icon type="clock-circle-o" style={{ fontSize: '20px', fontWeight: `bold`, color: `#000` }} />}>
          <span style={{marginLeft: `5px`, fontSize: '16px', fontWeight: `bold`, lineHeight: `20px`}}>{ formattedD }</span>
        </Timeline.Item>
      ]
      for (let h of this.state.history) {
        arr.push(this.historyRow(h, debug))
      }
      return arr
    } else if (this.state.loading) {
      return <div style={{textAlign: `center`}}><Spin size="large" /></div>
    } else {
      return <Empty description="Nothing to show here!" />
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

export default LogViewer

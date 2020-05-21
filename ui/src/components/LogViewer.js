import { Link } from "gatsby"
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
    HomeStream.subscribe('hs/1/' + topic.replace(/~~/g, '#').replace(/~/g,'+'), function(m) {
      const history = this.state.history
      let updated = false
      if (history.length && m.ts > history[0].ts) {
        // this is a new event
        history.unshift(m)
        updated = true
      }
      const objects = this.state.objects
      if (m.attribute !== 'to') {
        let o = objects[m.namespace + '/' + m.object_id]
        if (o === undefined) o = {}
        o[m.attribute] = m.val
        objects[m.namespace + '/' + m.object_id] = o
        updated = true
      }
      if (updated) this.setState({history, objects})
    }.bind(this))
    HomeStream.read('hs/1/+/+/+', function(resp) {
      const objects = this.state.objects
      for (let h of resp) {
        let o = objects[h.namespace + '/' + h.object_id]
        if (o === undefined) o = {}
        o[h.attribute] = h.val
        objects[h.namespace + '/' + h.object_id] = o
      }
      this.setState({objects})
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
      this.setState({history: history.concat(resp), disableLoadmore: resp.length < 1000, loading: false})
    }.bind(this))
  }

  showDebugInfo(history) {
    if (history.level === 'debug' || history.level === 'data') {
      return `[${history.object_id}/${history.event_type}] `
    }
  }

  renderText(msg) {
    const template = [msg.attribute, msg.data.template].join('/')
    switch(template) {
      case 'occupancy/':
        return "There ${val === 1 ? 'is' : 'are'} now ${val} ${val === 1 ? 'person' : 'people'} in here."
      case 'entry/':
        return "Somebody walked into @com.hiome/${entered} from @com.hiome/${exited}."
      case 'battery/critical':
        return "Replace battery now!"
      default:
        return null
    }
  }

  /**
   * Produces a function which uses template strings to do simple interpolation from objects.
   * Adapted from https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
   * 
   * Example: renderTemplate('The occupancy is now ${count}!', {count: 0}) //=> "The occupancy is now 0!"
   */
  templateFnCache = {}

  renderTemplate = (template, vals) => {
    let fn = this.templateFnCache[template]

    if (!fn) {
      // randomly generate a key for each fn so that attacker cannot bypass final replace with a predictable pattern
      const key = `key${Math.floor(Math.random() * 1000)}`
      // Replace ${expressions} (etc) with ${key.expressions}
      const sanitized = template
        // strip out unsafe characters ;{()
        // allow period and brackets to enable nested templates like extra.confidence or extra['confidence']
        // allow other non-alphanumeric characters to enable ternary operators like ${count === 1 ? 'is' : 'are'}
        // "$msg" can be used as a placeholder to reference the key, like ${count > 0 ? $msg.pos : $msg.neg}
        .replace(/\$\{([\s]*[^;\{\(\)]+[\s]*)\}/g, function(_, match) {
          match = match.trim().replace(/(\$msg)/g, key)
          if (match.startsWith(key)) return `\$\{${match}\}`
          return `\$\{${key}.${match}\}`
        })
        // Afterwards, replace anything that's not ${key.expressions}' (etc) with a blank string
        .replace(new RegExp(`(\$\{(?!${key})[^}]+\})`,'g'), '')

      fn = Function(key, `return \`${sanitized}\``)

      // update cache
      this.templateFnCache[template] = fn
    }

    return fn(vals)
  }

  addLinksToText(txt) {
    const parts = txt.split(/(@[\w\.\-]+\/[\w\-]+)/)
    return parts.map(function(w) {
      if (w.startsWith('@') && w.indexOf('/') !== -1) {
        const uuid = w.substr(1)
        if (uuid in this.state.objects) {
          return <em>{ this.state.objects[uuid].name }</em>
        }
      }
      return w
    }.bind(this))
  }

  historyRow(history, debug) {
    const o = this.state.objects[history.namespace + '/' + history.object_id] || {}
    const txt = this.renderText(history)
    if (!txt) return null
    return (
      <Timeline.Item key={`${history.topic}/${history.ts}`} color='blue' style={{clear: `both`}}>
        <div className="timeago" style={{
          display: `inline-block`,
          width: this.props.debug ? `7.5rem` : `4.5rem`,
          fontSize: `0.8rem`,
          color: `#ccc`
        }}><TimeAgo time={parseInt(history.ts)} debug={debug} /></div>
        <div style={{display: `inline-block`}}>
          <a href={`?t=${history.namespace}/${history.object_id}/~~`}>{ o.name || history.topic }</a>:
          { this.addLinksToText(this.renderTemplate(txt, history.data)) }
        </div>
      </Timeline.Item>
    )
  }

  renderHistory() {
    if (this.state.history.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const start = urlParams.get('s') || new Date().setHours(0,0,0,0)
      const debug = urlParams.get('debug') === 'true'
      const formattedD = strftime('%A, %B %e%t', new Date(start))
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

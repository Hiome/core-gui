import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from 'mqtt/dist/mqtt'
import { Button, Empty, Icon, Spin, Timeline } from 'antd'

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
      if (['info', 'warning'].indexOf(message['level']) === -1) return

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
        occurred_at: new Date()
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

  historyRow(history) {
    return (
      <Timeline.Item key={history.id} color={this.dotColor(history.level)} style={{clear: `both`}}>
        <div style={{
          display: `inline-block`,
          width: `4.5rem`,
          fontSize: `0.8rem`,
          color: `#ccc`
        }}>{ this.strftime('%l:%M %p', new Date(history.occurred_at)) }</div>
        <div style={{
          display: `inline-block`
        }}>{ history.message }</div>
      </Timeline.Item>
    )
  }

  renderHistory() {
    if (this.state.history.length > 0) {
      const arr = []
      let lastDate = null
      for (let h of this.state.history) {
        const formattedD = this.strftime('%A, %B %e%t', new Date(h.occurred_at))
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

  strftime(sFormat, date) {
    if (!(date instanceof Date)) date = new Date()
    var nDay = date.getDay(),
      nDate = date.getDate(),
      nMonth = date.getMonth(),
      nYear = date.getFullYear(),
      nHour = date.getHours(),
      aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
      isLeapYear = function() {
        return (nYear%4===0 && nYear%100!==0) || nYear%400===0
      },
      getThursday = function() {
        var target = new Date(date)
        target.setDate(nDate - ((nDay+6)%7) + 3)
        return target
      },
      zeroPad = function(nNum, nPad) {
        return ((Math.pow(10, nPad) + nNum) + '').slice(1)
      },
      nthSuffix = function() {
        if (nDate === 1 || nDate === 21 || nDate === 31) return 'st'
        if (nDate === 2 || nDate === 22) return 'nd'
        if (nDate === 3 || nDate === 23) return 'rd'
        return 'th'
      }
    return sFormat.replace(/%[a-z]/gi, function(sMatch) {
      return (({
        '%a': aDays[nDay].slice(0,3),
        '%A': aDays[nDay],
        '%b': aMonths[nMonth].slice(0,3),
        '%B': aMonths[nMonth],
        '%c': date.toUTCString(),
        '%C': Math.floor(nYear/100),
        '%d': zeroPad(nDate, 2),
        '%e': nDate,
        '%F': date.toISOString().slice(0,10),
        '%G': getThursday().getFullYear(),
        '%g': (getThursday().getFullYear() + '').slice(2),
        '%H': zeroPad(nHour, 2),
        '%I': zeroPad((nHour+11)%12 + 1, 2),
        '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth>1 && isLeapYear()) ? 1 : 0), 3),
        '%k': nHour,
        '%l': (nHour+11)%12 + 1,
        '%m': zeroPad(nMonth + 1, 2),
        '%n': nMonth + 1,
        '%M': zeroPad(date.getMinutes(), 2),
        '%p': (nHour<12) ? 'AM' : 'PM',
        '%P': (nHour<12) ? 'am' : 'pm',
        '%s': Math.round(date.getTime()/1000),
        '%S': zeroPad(date.getSeconds(), 2),
        '%t': nthSuffix(),
        '%u': nDay || 7,
        '%V': (function() {
                var target = getThursday(),
                  n1stThu = target.valueOf()
                target.setMonth(0, 1)
                var nJan1 = target.getDay()
                if (nJan1!==4) target.setMonth(0, 1 + ((4-nJan1)+7)%7)
                return zeroPad(1 + Math.ceil((n1stThu-target)/604800000), 2)
              })(),
        '%w': nDay,
        '%x': date.toLocaleDateString(),
        '%X': date.toLocaleTimeString(),
        '%y': (nYear + '').slice(2),
        '%Y': nYear,
        '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
        '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
      }[sMatch] || '') + '') || sMatch
    })
  }
}

LogViewer.propTypes = {
  endpoint: PropTypes.string
}

LogViewer.defaultProps = {
  endpoint: null
}

export default LogViewer

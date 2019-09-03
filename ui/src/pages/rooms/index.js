import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { connect } from 'mqtt/dist/mqtt'
import { Button, Empty, Icon, Spin, Timeline } from 'antd'

import LayoutPage from "../../components/LayoutPage"
import SEO from "../../components/seo"

class IndexPage extends Component {
  state = {
    id: null,
    name: 'Loading...',
    occupancy_count: 0,
    page: 0,
    history: [],
    loading: true,
    disableLoadmore: true
  }

  componentDidMount() {
    const params = (new URL(document.location)).searchParams
    const roomId = params.get('id')
    fetch(`${process.env.API_URL}api/1/rooms/${roomId}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState(resp)
        this.loadHistory()
      })

    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => {
      client.subscribe(`hiome/1/sensor/${roomId}:occupancy`, {qos: 1})
      client.subscribe('hiome/1/log', {qos: 1})
    })
    client.on('message', function(t, m, p) {
      if (m == null) return
      const message = JSON.parse(m.toString())
      if (t === `hiome/1/sensor/${roomId}:occupancy`) {
        if (message['meta'] && message['meta']['type'] === 'occupancy' && message['meta']['source'] === 'gateway') {
          this.setState({occupancy_count: message['val']})
        }
      } else if (t === 'hiome/1/log' && message['device_type'] === 'room' && message['device_id'] === roomId) {
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
      }
    }.bind(this))
  }

  loadHistory = () => {
    const pageSize = 50
    const page = this.state.page
    const history = this.state.history
    this.setState({loading: true})
    fetch(`${process.env.API_URL}api/1/logs/room/${this.state.id}?size=${pageSize}&page=${page}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({history: history.concat(resp), page: page+1, disableLoadmore: resp.length < pageSize, loading: false})
      })
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
    }).then(resp => resp.json()).then(resp => this.setState({occupancy_count: resp.occupancy_count}))
  }

  dotColor(level) {
    if (level === 'debug') return 'gray'
    else if (level === 'info') return 'blue'
    else if (level === 'data') return 'green'
    return 'red'
  }

  historyRow(history) {
    return (
      <Timeline.Item key={history.id} color={this.dotColor(history.level)}>
        <span style={{
          width: `5rem`,
          display: `inline-block`,
          fontSize: `0.8rem`,
          color: `#ccc`
        }}>{ this.strftime('%l:%M %p', new Date(history.occurred_at)) }</span>
        <span style={{
        }}>{ history.message }</span>
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
      return <Empty description="No history yet. Walk through this door!" />
    }
  }

  renderLoadMore() {
    if (this.state.disableLoadmore) return
    return <Button icon="reload" onClick={this.loadHistory} type="primary" loading={this.state.loading}>Load More</Button>
  }

  headline() {
    return (<>
      <h1 style={{color: `#fff`, fontSize: `5em`}}>{ this.state.occupancy_count }</h1>
      <h2 style={{color: `#fff`, textAlign: `center`, marginTop: `-20px`}}>{ this.state.name }</h2>
      <div style={{textAlign: `center`, margin: `1em auto 5em auto`}}>
        <Button icon="edit" shape="circle" size="small" ghost onClick={this.setOcc} />
        <Button icon="setting" shape="circle" size="small" ghost
          onClick={() => navigate(`/settings/room?id=${this.state.id}`)} style={{marginLeft: `10px`}} />
      </div>
    </>)
  }

  render() {
    return (
      <LayoutPage goBack={true} headline={this.headline()}>
        <SEO title={this.state.name} />
        <Timeline>
          { this.renderHistory() }
        </Timeline>
        { this.renderLoadMore() }
      </LayoutPage>
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

export default IndexPage

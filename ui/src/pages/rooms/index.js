import React, { Component } from 'react'
import { connect } from 'mqtt/dist/mqtt'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import "./logs.css"

class IndexPage extends Component {
  state = {
    id: null,
    name: 'Loading...',
    occupancy_count: 0,
    doors: 0,
    page: 0,
    history: []
  }

  async componentDidMount() {
    const params = (new URL(document.location)).searchParams
    const roomId = params.get('id')
    const json = await fetch(`${process.env.API_URL}api/1/rooms/${roomId}`).then(resp => resp.json())
    this.setState(json)

    const client = connect(`ws://${window.location.host}:1884`)
    client.on('connect', () => {
      client.subscribe(`hiome/1/sensor/${roomId}:occupancy`, {qos: 1})
      client.subscribe('hiome/1/log', {qos: 1})
    })
    client.on('message', function(t, m, p) {
      const message = JSON.parse(m.toString())
      if (t === `hiome/1/sensor/${roomId}:occupancy`) {
        if (message['meta']['type'] === 'occupancy' && message['meta']['source'] === 'gateway') {
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
    this.loadHistory()
  }

  loadHistory = (e) => {
    if (e) e.preventDefault()
    const pageSize = 50
    const page = this.state.page
    const history = this.state.history
    fetch(`${process.env.API_URL}api/1/logs/room/${this.state.id}?size=${pageSize}&page=${page}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({history: history.concat(resp), page: page+1})
        return resp
      })
      .then(resp => { if (resp.length < pageSize) document.getElementById('loadmore').remove() })
    return false
  }

  setOcc = (e) => {
    e.preventDefault()

    let count = this.state.occupancy_count
    count = prompt(`How many people are in ${this.state.name}?`, count - 1)
    count = parseInt(count)
    if (isNaN(count) || count <= 0) return
    if (count > 100) count = 100

    fetch(`${process.env.API_URL}api/1/rooms/${this.state.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({occupancy_count: count})
    }).then(resp => resp.json()).then(resp => this.setState({occupancy_count: resp.occupancy_count}))

    return false
  }

  people() {
    return this.state.occupancy_count === 1 ? "person" : "people"
  }

  are() {
    return this.state.occupancy_count === 1 ? "is" : "are"
  }

  historyRow(history) {
    return (
      <div key={history.id} className={`historyRow ${history.level}`}>
        <span className="time">{ this.strftime('%l:%M %p', new Date(history.occurred_at)) }</span>
        <span className="message">{ history.message }</span>
      </div>
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
          arr.push(<h3 key={formattedD}>{ formattedD }</h3>)
        }
        arr.push(this.historyRow(h))
      }
      return arr
    } else {
      return <h2 style={{textAlign: `center`, color: `#A17EDF`, margin: `100px`}}>No history found.</h2>
    }
  }

  render() {
    return (
      <Layout goBack={true}>
        <SEO title={this.state.name} />
        <div className="headline">
          <h1>{ this.state.name }</h1>
          <p>
            There { this.are() } <strong>{ this.state.occupancy_count }</strong> { this.people() } in here right now. <a href="#" onClick={this.setOcc}>Edit</a>
          </p>
        </div>
        <div className="page">
          <h2>History</h2>
          { this.renderHistory() }
          <a href="#" id="loadmore" onClick={this.loadHistory}>Load More...</a>
        </div>
        <footer>&copy; Hiome Inc 2019</footer>
      </Layout>
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

import React, { Component } from "react"
import PropTypes from "prop-types"

import strftime from "./strftime"

class TimeAgo extends Component {
  state = {
    formattedTime: ''
  }

  componentDidMount() {
    this.setState({formattedTime: this.format(this.props.time)})
  }

  format(time) {
    const d = new Date(time)
    const totalSec = Math.floor((new Date() - d)/1000)
    // set a timer to format this time again in 1 second
    if (totalSec < 60) setTimeout(this.componentDidMount.bind(this), (10 - (totalSec % 10))*1000)
    else if (totalSec < 300) setTimeout(this.componentDidMount.bind(this), 61000)

    if (totalSec < 5) return 'just now'
    if (totalSec < 60) return `${totalSec} sec ago`
    if (totalSec < 300) return `${Math.floor(totalSec/60)} min ago`
    return strftime('%l:%M %p', d)
  }

  render() {
    return <time>{this.state.formattedTime}</time>
  }
}

TimeAgo.propTypes = {
  time: PropTypes.number.isRequired
}

export default TimeAgo
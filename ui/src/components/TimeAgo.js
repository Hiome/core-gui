import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Tooltip } from 'antd'

import strftime from "./strftime"

class TimeAgo extends PureComponent {
  state = {
    formattedTime: ''
  }

  componentDidMount() {
    this.setState({formattedTime: this.format(this.props.time, this.props.debug)})
  }

  componentWillUnmount() {
    if (this.timerHandler) {
      clearTimeout(this.timerHandler)
      this.timerHandler = 0
    }
  }

  format(time, debug) {
    const d = new Date(time)
    if (debug) {
      return strftime('%l:%M:%S.%f %p', d)
    }

    const totalSec = Math.floor((new Date() - d)/1000)
    // set a timer to format this time again every 5 seconds
    if (totalSec < 60) this.timerHandler = setTimeout(this.componentDidMount.bind(this), (5 - (totalSec % 5))*1000)
    // or every minute after the first 60 seconds
    else if (totalSec < 300) this.timerHandler = setTimeout(this.componentDidMount.bind(this), 61000)

    if (totalSec < 5) return 'just now'
    if (totalSec < 60) return `${totalSec} sec ago`
    if (totalSec < 300) return `${Math.floor(totalSec/60)} min ago`
    return strftime('%l:%M %p', d)
  }

  render() {
    const d = new Date(this.props.time)
    return (
      <Tooltip title={strftime('%l:%M:%S %p', d)}>
        <time dateTime={d}>{this.state.formattedTime}</time>
      </Tooltip>
    )
  }
}

TimeAgo.propTypes = {
  time: PropTypes.number.isRequired,
  debug: PropTypes.bool
}

TimeAgo.defaultProps = {
  debug: false
}

export default TimeAgo

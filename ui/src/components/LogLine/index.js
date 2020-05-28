import React, { PureComponent } from 'react'
import PropTypes from "prop-types"
import { Avatar } from 'antd'
import TimeAgo from "../TimeAgo"

import "./style.css"

class LogLine extends PureComponent {
  colorize(input) {
    var stringHexNumber = (
      parseInt(parseInt(input, 36).toExponential().slice(2,-5), 10) & 0xFFFFFF
    ).toString(16).toUpperCase();
    return '#' + ('000000' + stringHexNumber).slice(-6);
  }

  smartTrim(input) {
    if (input.length < 9) return input
    input = input.split(" ")[0]
    return input.substring(0, 9)
  }

  render() {
    return (
      <div className={`log-line ${this.props.knownContext ? 'log-contextual' : ''}`} key={`${this.props.topic}/${this.props.ts}`}>
        <div className="log-avatar">
          <Avatar style={{ backgroundColor: this.colorize(this.props.name) }} shape="square" size="large">
            {this.smartTrim(this.props.name)}
          </Avatar>
        </div>
        <div className="log-message">
          <div className="log-meta">
            <span className="log-author">
              <Link to={`/hs/1/${this.props.uuid}/~~`}>{ this.props.name }</Link>
            </span>
            <span className="log-time">
              <TimeAgo time={this.props.ts} />
            </span>
          </div>
          <div className="log-content">
            {this.props.children}
            <p>{this.props.context_topic} {this.props.context_ts} {this.props.knownContext}</p>
          </div>
        </div>
      </div>
    )
  }
}

LogLine.propTypes = {
  children: PropTypes.node.isRequired,
  topic: PropTypes.string.isRequired,
  ts: PropTypes.number.isRequired,
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  knownContext: PropTypes.bool,
  context_topic: PropTypes.string,
  context_ts: PropTypes.number
}

LogLine.defaultProps = {
  knownContext: false,
  context_topic: null,
  context_ts: null
}

export default LogLine

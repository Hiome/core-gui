import React, { PureComponent } from 'react'
import PropTypes from "prop-types"
import { Tooltip } from 'antd'

import './style.css'

class Battery extends PureComponent {
  status() {
    switch(this.props.label) {
      case 'full':
        return 'The battery is fully charged.'
      case 'high':
        return 'The battery level is high.'
      case 'normal':
        return 'The battery level is good.'
      case 'low':
        return 'The battery is running low. Recharge soon!'
      case 'critical':
        return 'Recharge battery immediately!'
      default:
        return 'The battery level is unknown.'
    }
  }

  render() {
    if (!this.props.label || this.props.label === 'none') return null
    return <Tooltip title={this.status()}>
      <div className={`battery battery-${this.props.label}`}></div>
    </Tooltip>
  }
}

Battery.propTypes = {
  level: PropTypes.string
}

Battery.defaultProps = {
  level: null
}

export default Battery

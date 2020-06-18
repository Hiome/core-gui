import React, { PureComponent } from "react"
import PropTypes from "prop-types"

import './style.css'

class Collapsible extends PureComponent {
  state = {
    expanded: false
  }

  toggleDebug = (e) => {
    e.preventDefault()
    this.setState({expanded: !this.state.expanded})
    return false
  }

  render() {
    return (<div className="collapsible">
      <div className="expansion_btn">
        <a className={`expandable icononly ${this.state.expanded ? 'active' : ''}`} href="#" title="Expand details" onClick={this.toggleDebug}>
          <svg width="0.7em" height="0.7em" viewBox="0 0 16 16" fill="#A6B1BB" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clipRule="evenodd"/>
          </svg> {this.props.title}
        </a>
      </div>
      <div className="collapsible_content" style={{maxHeight: this.state.expanded ? '100%' : '0'}}>
        { this.props.children }
      </div>
    </div>)
  }
}

Collapsible.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired
}

Collapsible.defaultProps = {
  title: 'Debug'
}

export default Collapsible

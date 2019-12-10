import { Slider, Icon } from "antd"
import React, { Component } from "react"
import PropTypes from "prop-types"

import "./style.css"

class SensitivitySlider extends Component {
  state = {
    value: 0
  }

  componentWillMount() {
    this.setState({value: this.props.value})
  }

  handleChange = value => {
    this.setState({value})
    fetch(`${process.env.API_URL}api/1/sensors/${this.props.sensorId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({sensitivity: value})
    })
  }

  babyIcon() {
    return <svg height='1.2em' width='1.2em' fill="#c0c0c0" x="0px" y="0px" viewBox="0 0 88.99 64.152"><g><circle cx="73.494" cy="15.497" r="15.497"></circle><path d="M60.764,34.166c-0.196-0.668-0.487-1.281-0.852-1.834c-1.657-6.382-7.44-11.102-14.341-11.102H27.311   c-8.194,0-14.836,6.643-14.836,14.836c0,2.722,0.745,5.264,2.023,7.457c0.023,0.342,0.064,0.685,0.141,1.029l-0.003-0.002   l1.249,5.637H6.832C3.059,50.187,0,53.246,0,57.019c0,3.771,3.059,6.834,6.832,6.834h17.567c2.073,0,4.027-0.941,5.327-2.559   c1.297-1.617,1.79-3.731,1.342-5.754l-1.028-4.639h15.531c1.967,0,3.841-0.392,5.559-1.087l2.777,9.435   c0.875,2.973,3.598,4.902,6.548,4.902c0.64,0,1.291-0.09,1.935-0.279c3.618-1.063,5.691-4.861,4.623-8.48L60.764,34.166z"></path></g></svg>
  }

  adultIcon() {
    return <svg height='1.2em' width='1.2em' fill="#c0c0c0" x="0px" y="0px" viewBox="0 0 103.468 238.183"><g><ellipse transform="matrix(0.2268 -0.9739 0.9739 0.2268 18.0322 67.7132)" cx="51.662" cy="22.5" rx="22.495" ry="22.495"></ellipse><path d="M13.334,151.072c0.556,0,1.121-0.058,1.687-0.18c4.318-0.927,7.069-5.18,6.145-9.501   c-3.732-17.38-5.168-30.859-5.166-41.142c-0.002-8.854,1.062-15.319,2.526-19.913c1.857-5.715,4.115-8.516,6.09-10.13v38.673   v18.939v98c0,6.829,5.536,12.363,12.363,12.363c6.828,0,12.364-5.534,12.364-12.363v-90.272h4.636v90.272   c0,6.829,5.536,12.363,12.363,12.363c6.828,0,12.364-5.534,12.364-12.363v-98v-18.939V70.076c1.221,0.97,2.519,2.406,3.838,4.659   c2.519,4.376,4.928,12.214,4.921,25.516c0.004,10.282-1.434,23.761-5.162,41.142c-0.927,4.32,1.824,8.573,6.145,9.501   c0.565,0.121,1.13,0.18,1.685,0.18c3.691,0,7.009-2.571,7.815-6.325c3.901-18.211,5.514-32.741,5.518-44.497   c-0.004-10.119-1.197-18.2-3.278-24.756c-3.067-9.819-8.434-16.242-14.008-19.699c-5.556-3.489-10.818-4.038-13.656-4.038   c-0.206,0-0.385,0.006-0.568,0.011c-0.321-0.041-0.646-0.069-0.978-0.069H32.344c-0.327,0-0.646,0.027-0.962,0.066   c-0.146-0.003-0.279-0.008-0.439-0.008c-1.91,0.002-4.846,0.243-8.277,1.44c-5.144,1.741-11.321,5.95-15.633,13.595   C2.682,74.428,0.006,85.094,0,100.25c0.002,11.758,1.615,26.288,5.52,44.497C6.326,148.502,9.644,151.072,13.334,151.072z"></path></g></svg>
  }

  render() {
    return (
      <div style={{marginTop: `30px`}}>
        <strong>Sensitivity</strong>
        <div className="icon-wrapper">
          <Icon component={this.babyIcon} />
          <Slider min={0} max={2} step={0.1} tipFormatter={null} value={this.state.value} onChange={this.handleChange} marks={{
            0: 'High',
            0.9: 'Default',
            2: 'Low'
          }} />
          <Icon component={this.adultIcon} />
        </div>
      </div>
    )
  }
}

SensitivitySlider.propTypes = {
  sensorId: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
}

export default SensitivitySlider

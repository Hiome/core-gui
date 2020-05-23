import { Link, navigate } from "gatsby"
import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import Sherlock from 'sherlockjs'
import { Input } from 'antd'

class DatePicker extends PureComponent {
  state = {
    errors: ''
  }

  parseDate = (e) => {
    let val = e.target.value
    if (val.length >= 3) {
      val = val.trim() + ' ago'
      const {startDate} = Sherlock.parse(val)
      if (startDate) {
        console.log(startDate)
        const currDate = new Date()
        currDate.setHours(23,59,59,59) // end of day
        // if this new time is in the future or older than 2 weeks ago, ignore it
        if (startDate > currDate) {
          this.setState({errors: 'Sorry, I cannot show you the future yet.'})
          return
        }
        if (startDate < currDate.setDate(currDate.getDate() - 14)) {
          this.setState({errors: 'Sorry, that\'s too far in the past.'})
          return
        }
        if (startDate.setHours(0,0,0,0) !== this.props.day) {
          navigate(`/hs/1/${this.props.topic}/${startDate.getTime()}`)
        }
      }
    }
    this.setState({errors: ''})
  }

  showTodayLink() {
    const td = new Date().setHours(0,0,0,0)
    if (this.props.day === td) return null
    return (
      <div style={{textAlign:'center'}}>
        <div style={{margin:'5px',color:'#ccc'}}>or</div>
        <Link to={`/hs/1/${this.props.topic}/${td}`}>View Today</Link>
      </div>
    )
  }

  render() {
    return (<>
        <Input type="text" placeholder="Type a date" onChange={this.parseDate} />
        <p style={{color: '#BF0E08',marginBottom:'0'}}>{this.state.errors}</p>
        {this.showTodayLink()}
      </>
    )
  }
}

DatePicker.propTypes = {
  topic: PropTypes.string.isRequired,
  day: PropTypes.number.isRequired
}

export default DatePicker

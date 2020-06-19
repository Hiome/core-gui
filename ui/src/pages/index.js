import { Link, navigate } from "gatsby"
import React, { Component } from 'react'
import { Result, Button, Icon, Spin } from 'antd'

import Layout from "../components/Layout"
import HomeStream from '../components/homestream'
import RoomRow from '../components/RoomRow'

import "./rooms.css"

class IndexPage extends Component {
  state = {
    rooms: [],
    loading: true,
    missingSensors: 0
  }

  componentDidMount() {
    // load all rooms
    fetch(`${process.env.API_URL}api/1/rooms`).then(resp => resp.json()).then(resp => this.setState({rooms: resp, loading: false}))

    // figure out how many sensors haven't been configured yet
    fetch(`${process.env.API_URL}api/1/sensors?type=door`)
      .then(resp => resp.json())
      .then(resp => this.setState({missingSensors: resp.filter(s => s.room_id === null).length}))

    // subscribe to live updates
    HomeStream.subscribe('hs/1/com.hiome/+/occupancy', function(m) {
      this.setState((prevState, props) => {
        const rooms = prevState.rooms
        for (let r of rooms) {
          if (r.id === m.object_id) {
            r.occupancy_count = m.val
            break
          }
        }
        return ({rooms})
      })
    }.bind(this))
  }

  addRoomRow() {
    return (
      <Link key='add_sensor' to='/sensors/add' className='room active' title='Add New Sensor'>
        <Button icon="plus" shape="circle" ghost
          style={{marginRight: '10px', verticalAlign: 'middle', color: '#000'}}
        /> Add {this.state.missingSensors} Door{this.state.missingSensors === 1 ? '' : 's'}
      </Link>
    )
  }

  renderRooms() {
    if (this.state.loading) {
      return <div style={{textAlign: `center`, marginTop: `10em`}} key="index-loader">
        <Spin size="large" indicator={<Icon type="loading" />} />
      </div>
    } else if (this.state.rooms.length > 0) {
      const arr = this.state.rooms.sort((a,b) => {
        if (a.occupancy_count === b.occupancy_count) {
          return a.name.localeCompare(b.name)
        }
        if (a.occupancy_count < b.occupancy_count) return 1
        if (a.occupancy_count > b.occupancy_count) return -1
        return 0
      }).map(r => <RoomRow key={r.id} id={r.id} name={r.name} occupancy_count={r.occupancy_count} />)
      if (this.state.missingSensors > 0)
        arr.push(this.addRoomRow())
      return arr
    } else {
      return <Result
        icon={<span role="img" aria-label="hurray" style={{fontSize: `5em`}}>🎉</span>}
        title="Welcome to Hiome!"
        subTitle={<p>This will be your dashboard, but it's a little empty right now. Let's add a door.</p>}
        extra={<Button onClick={() => navigate('/sensors/add')} type="primary" size="large" icon="plus">Add New Door</Button>}
      />
    }
  }

  render() {
    return <Layout title="Rooms">
      { this.renderRooms() }
    </Layout>
  }
}

export default IndexPage

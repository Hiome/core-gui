import { Link, navigate } from "gatsby"
import { Icon, Card, List, Empty, message } from "antd"
import React, { Component } from 'react'

import SettingsMenu from "../../components/SettingsMenu"
import LayoutPage from "../../components/LayoutPage"
import SEO from "../../components/seo"

class RoomsSettingsPage extends Component {
  state = {
    rooms: [],
    loading: true
  }

  componentDidMount() {
    if (this.props.location.state.justDeleted) {
      message.success(`${this.props.location.state.justDeleted} was successfully deleted.`)
    }

    this.setState({loading: true})
    fetch(`${process.env.API_URL}api/1/rooms?include_hidden=true`).then(resp => resp.json()).then(resp => this.setState({rooms: resp, loading: false}))
  }

  renderEmptyRoom() {
    return (
      <svg height='100px' width='100px'  fill="#000000" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 90 90"xmlSpace="preserve"><g><path d="M82.35,15.78c-0.1-0.09-0.24-0.13-0.37-0.13l-36.95,5.71L8.02,15.65c-0.14,0-0.27,0.04-0.37,0.13   C7.56,15.87,7.5,16,7.5,16.14v38.45c0,0.18,0.1,0.35,0.26,0.44L44.77,74.3c0.07,0.04,0.15,0.06,0.23,0.06   c0.08,0,0.16-0.02,0.23-0.06l37.01-19.27c0.16-0.09,0.27-0.25,0.27-0.44V16.14C82.5,16,82.44,15.87,82.35,15.78z M8.64,16.83   l35.72,5.63v25.17l-8.88,1.54l-0.03-21.27c0-0.27-0.2-0.51-0.48-0.54l-11.84-1.19c-0.16-0.02-0.32,0.03-0.44,0.13   c-0.12,0.1-0.19,0.25-0.19,0.41v24.71L8.64,53.82V16.83z M34.37,49.35L23.6,51.22V27.33l10.74,1.04L34.37,49.35z M13.99,56.98   l-4-2.08L45,48.82l2.48,0.43l-33.16,7.91L13.99,56.98z M14.77,57.39l33.54-7.99l4.06,0.71l-33.16,9.6L14.77,57.39z M19.63,59.92   l33.47-9.69l4.16,0.72L24.23,62.32L19.63,59.92z M24.63,62.53l33.3-11.46l4.93,0.86L29.41,65.02L24.63,62.53z M29.8,65.22   l33.69-13.19l5.23,0.91L34.47,67.65L29.8,65.22z M34.85,67.85l34.46-14.81l4.74,0.82L39.73,70.39L34.85,67.85z M45,73.13   l-4.91-2.55l34.51-16.62l5.41,0.94L45,73.13z M81.36,53.82l-35.71-6.2V22.45l35.71-5.63V53.82z"></path><path d="M76.13,28.46c-0.19-0.17-0.42-0.26-0.67-0.26c-0.03,0-0.06,0-0.1,0l-10.38,1c-0.51,0.05-0.9,0.48-0.9,1v7.88   c0,0.52,0.4,0.96,0.93,1l10.38,0.75c0.02,0,0.05,0,0.07,0c0.25,0,0.5-0.1,0.68-0.27c0.2-0.19,0.32-0.45,0.32-0.73V29.2   C76.46,28.92,76.34,28.65,76.13,28.46z M75.46,29.2v4.84H70.2v-4.34L75.46,29.2z M69.92,29.74v4.31h-4.84V30.2L69.92,29.74z    M65.08,34.33h4.84v4.1l-4.84-0.35V34.33z M70.2,38.45v-4.12h5.25v4.5L70.2,38.45z"></path></g></svg>
    )
  }

  renderRooms() {
    if (this.state.loading || this.state.rooms.length > 0) {
      return (
        <List
          dataSource={this.state.rooms}
          rowKey={item => `room${item.id}`}
          loading={this.state.loading}
          grid={{
            gutter: 25,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          renderItem={room => <List.Item>
              <Card style={{textAlign: `center`, minWidth: `200px`}} hoverable={true}
                onClick={() => navigate(`/settings/room?id=${room.id}`)} actions={[
                <Link to={`/settings/room?id=${room.id}`}><Icon type="edit" /> Edit</Link>
              ]}>
                <div style={{
                  textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap`
                }}>
                  {room.name}
                </div>
              </Card>
            </List.Item>
          }
        />
      )
    } else {
      return (
        <Empty image={this.renderEmptyRoom()} imageStyle={{height: 80}} description={"No rooms found."} />
      )
    }
  }

  render() {
    return (
      <LayoutPage goBack={true}>
        <SEO title="Settings" />
        <h1>Settings</h1>
        <SettingsMenu page="rooms" />

        { this.renderRooms() }
      </LayoutPage>
    )
  }
}

export default RoomsSettingsPage

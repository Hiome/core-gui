import { Link } from "gatsby"
import { Menu } from "antd"
import React from "react"
import PropTypes from "prop-types"

const SettingsMenu = ({ page }) => (
  <Menu selectedKeys={[page]} mode="horizontal">
    <Menu.Item key="doors">
      <Link to="/settings">Doors</Link>
    </Menu.Item>
    <Menu.Item key="rooms">
      <Link to="/settings/rooms">Rooms</Link>
    </Menu.Item>
    <Menu.Item key="homekit">
      <Link to="/settings/integrations/homekit">HomeKit</Link>
    </Menu.Item>
    <Menu.Item key="hue">
      <Link to="/settings/integrations/hue">Hue</Link>
    </Menu.Item>
  </Menu>
)

SettingsMenu.propTypes = {
  page: PropTypes.string.isRequired
}

export default SettingsMenu

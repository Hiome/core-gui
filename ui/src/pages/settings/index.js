import { Link } from "gatsby"
import React, { Component } from 'react'

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import "./settings.css"

class SettingsPage extends Component {
  render() {
    return (
      <Layout goBack={true}>
        <SEO title="Settings" />
        <div className="headline">
          <h1>Settings</h1>
        </div>
        <div className="page">
          <Link to="/settings/rooms" className="settingsRow">Manage Rooms</Link>
          <Link to="/settings/sensors" className="settingsRow">Manage Sensors</Link>
        </div>
        <footer>&copy; Hiome Inc 2019</footer>
      </Layout>
    )
  }
}

export default SettingsPage

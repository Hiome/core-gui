import React from 'react'
import { Link } from "gatsby"
import { Popover } from 'antd'

import LayoutPage from "../components/LayoutPage"
import SEO from "../components/seo"
import EntryViewer from '../components/EntryViewer'

import "./rooms.css"

const sensorId = (pathname) => {
  const path = pathname.split("/").filter(x => x)
  return path.pop()
}

const debugging = (search) => {
  const urlParams = new URLSearchParams(search)
  return urlParams.get('debug') === 'true'
}

const DoorTrainPage = (props) => {
  return (<LayoutPage>
      <SEO title="Train Sensor" />
      <EntryViewer filter={sensorId(props.location.pathname)} debug={debugging(props.location.search)} />
    </LayoutPage>
  )
}

export default DoorTrainPage

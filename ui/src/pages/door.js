import React from 'react'

import LayoutPage from "../components/LayoutPage"
import SEO from "../components/seo"
import EntryViewer from '../components/EntryViewer'

import "./rooms.css"

const sensorId = (pathname) => {
  const filter = pathname.split("/").filter(x => x).pop()
  return filter === 'door' ? '' : filter
}

const debugging = (search) => {
  const urlParams = new URLSearchParams(search)
  return urlParams.get('debug') === 'true'
}

const DoorTrainPage = (props) => {
  return (<LayoutPage goBack={true}>
      <SEO title="Train Sensor" />
      <EntryViewer filter={sensorId(props.location.pathname)} debug={debugging(props.location.search)} />
    </LayoutPage>
  )
}

export default DoorTrainPage

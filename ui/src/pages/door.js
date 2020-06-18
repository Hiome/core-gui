import React from 'react'

import Layout from "../components/Layout"
import EntryViewer from '../components/EntryViewer'

const sensorId = (pathname) => {
  const filter = pathname.split("/").filter(x => x).pop()
  return filter === 'door' ? '' : filter
}

const debugging = (search) => {
  const urlParams = new URLSearchParams(search)
  return urlParams.get('debug') === 'true'
}

const DoorTrainPage = (props) => {
  return (<Layout title="Calibrate">
      <div className="explainer">
        <span role="img" aria-label="hey">👋</span> I learn which entries are valid and which are noise over time, but you can help me get more confident.
        Just walk through doors and tell me if the entry was real or not. If you're not sure, skip it.
      </div>
      <h3>Are these entries real?</h3>
      <EntryViewer filter={sensorId(props.location.pathname)} debug={debugging(props.location.search)} />
    </Layout>
  )
}

export default DoorTrainPage

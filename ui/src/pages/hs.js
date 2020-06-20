import React, { useState } from 'react'
import { Button, DatePicker } from 'antd'
import moment from 'moment';

import Layout from "../components/Layout"
import strftime from "../components/strftime"
import LogViewer from '../components/LogViewer'

import "./hs.css"

// /hs, /hs/1/ns/obj/attr, /hs/1/ns/obj/to/ns/obj/attr
const currentTopic = (pathname) => {
  const path = pathname.split("/").filter(x => x)
  if (path.length >= 5) {
    path.shift() // "hs"
    path.shift() // "1"
    return path.join('/')
  }
  return '~/~/~~'
}

const debugging = (search) => {
  const urlParams = new URLSearchParams(search)
  return urlParams.get('debug') === 'true'
}

const HomeStreamPage = (props) => {
  const topic = currentTopic(props.location.pathname)
  const debug = debugging(props.location.search)
  const [day, setDay] = useState(new Date().setHours(0,0,0,0))

  return (
    <Layout title="History">
      <DatePicker format="dddd, MMMM Do" size="large" value={moment(day)} style={{marginBottom: `2em`}} allowClear={false}
        disabledDate={(d) => d > moment().endOf('day')} onChange={(m,s) => setDay(m.startOf('day').valueOf())} />

      <LogViewer topic={topic} day={day} debug={debug} />

      <div className="pagination">
        <Button type="link" onClick={() => setDay(day - 86400000)} className="newer">
          &#x2190; &nbsp; {strftime('%A, %B %e%t', new Date(day - 86400000))}
        </Button>

        <Button type="link" onClick={() => setDay(day + 86400000)} className={`older ${day >= new Date().setHours(0,0,0,0) ? 'hidden' : ''}`}>
          {strftime('%A, %B %e%t', new Date(day + 86400000))} &nbsp; &#x2192;
        </Button>
        <div className="clear"></div>
      </div>
    </Layout>
  )
}

export default HomeStreamPage

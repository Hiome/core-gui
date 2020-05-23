import React from 'react'
import { Link } from "gatsby"
import { Popover } from 'antd'

import LayoutPage from "../components/LayoutPage"
import SEO from "../components/seo"
import strftime from "../components/strftime"
import DatePicker from '../components/DatePicker'
import LogViewer from '../components/LogViewer'

import "./rooms.css"

// /hs, /hs/1/ns/obj/attr, /hs/1/ns/obj/to/ns/obj/attr
const currentTopic = (pathname) => {
  const path = pathname.split("/").filter(x => x)
  const day = path.length === 6 || path.length === 9 ? parseInt(path.pop()) : new Date().setHours(0,0,0,0)
  if (path.length >= 5) {
    path.shift() // "hs"
    path.shift() // "1"
    return [path.join('/'), day]
  }
  return ['~/~/~~', day]
}

const debugging = (search) => {
  const urlParams = new URLSearchParams(search)
  return urlParams.get('debug') === 'true'
}

const HomeStreamPage = (props) => {
  const [topic, day] = currentTopic(props.location.pathname)
  // const debug = debugging(props.location.search)

  return (<LayoutPage>
      <SEO title="HomeStream" />
      <Popover content={<DatePicker topic={topic} day={day} />} title="Change Date" placement="bottomLeft">
        <div className="logDate">{ strftime('%A, %b %e%t', new Date(day)) }</div>
      </Popover>

      <LogViewer topic={topic} day={day} />

      <div className="pagination">
        <Link to={`/hs/1/${topic}/${day - 86400000}`} className="newer">
          &#x2190; &nbsp; {strftime('%A, %B %e%t', new Date(day - 86400000))}
        </Link>

        <Link to={`/hs/1/${topic}/${day + 86400000}`} className={`older ${day >= new Date().setHours(0,0,0,0) ? 'hidden' : ''}`}>
          {strftime('%A, %B %e%t', new Date(day + 86400000))} &nbsp; &#x2192;
        </Link>
        <div className="clear"></div>
      </div>
    </LayoutPage>
  )
}

export default HomeStreamPage

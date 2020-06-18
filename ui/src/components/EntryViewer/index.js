import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Avatar, Button, Empty, Spin, Tag, message } from 'antd'

import TimeAgo from '../TimeAgo'
import HomeStream from '../homestream'
import Collapsible from '../Collapsible'

import '../LogViewer/style.css'
import './style.css'

// object attribute reducer
const updateObjects = (newObjs, acc) => {
  if (!Array.isArray(newObjs)) newObjs = Array(newObjs)
  if (!acc) acc = {}
  for (let m of newObjs) {
    let o = acc[m.uuid]
    if (o === undefined) o = {}
    o[m.attribute] = m.data
    acc[m.uuid] = o
  }
  return acc
}

const fetcher = url => fetch(url).then(resp => resp.json()).then(resp => {
      resp.forEach(m => {
        m.uuid = m.namespace + '/' + m.object_id
        m.ts = m.data.ts
        m.val = m.data.val
      })
      return resp
    })

const entryFetcher = url => fetch(url).then(resp => resp.json())

const colorize = (input) => {
  const stringHexNumber = (
    parseInt(parseInt(input, 36).toExponential().slice(2,-5), 10) & 0xFFFFFF
  ).toString(16).toUpperCase()
  return '#' + ('000000' + stringHexNumber).slice(-6)
}

const smartTrim = (input) => {
  if (input.length < 9) return input
  input = input.split(" ")[0]
  return input.substring(0, 9)
}

const renderLog = (row, objects, debug) => {
  if (!row || !objects || !row.confidence) return null
  const o = objects['com.hiome/'+row.sensor_id] || {}
  if (!o.name) return null
  let template = null
  if (row.entered && objects['com.hiome/' + row.entered] && objects['com.hiome/' + row.entered].name) {
    template = `Did somebody walk into ${objects['com.hiome/' + row.entered].name.val}?`
  } else if (row.exited && objects['com.hiome/' + row.exited] && objects['com.hiome/' + row.exited].name) {
    template = `Did somebody walk out of ${objects['com.hiome/' + row.exited].name.val}?`
  }
  if (template === null) return null
  return (
    <div className="log-container" key={`${row.sensor_id}/${row.ts}`}>
      <div className="log-line">
        <div className="log-avatar">
          <Avatar style={{ backgroundColor: colorize(o.name.val) }} shape="square" size="large">
            {smartTrim(o.name.val)}
          </Avatar>
        </div>
        <div className="log-message">
          <div className="log-meta">
            <span className="log-author">
              <Link to={`/door/${row.sensor_id}`}>{ o.name.val }</Link>
            </span>
            <span className="log-time">
              <TimeAgo time={row.ts} />
            </span>
          </div>
          <div className="log-content">
            <p>
              <span className={row.is_valid ? 'valid-entry' : 'invalid-entry'}>{ template }</span>
              <span className={row.is_valid ? 'valid-confidence' : 'invalid-confidence'}>{Math.floor(row.confidence*100)}% confident</span>
            </p>
            <RevertLink sensorId={row.sensor_id} isValid={row.is_valid} corrected={row.corrected} ts={row.ts} />
            { debug ? <Collapsible><pre>{ JSON.stringify(row, null, 2) }</pre></Collapsible> : null }
          </div>
        </div>
      </div>
    </div>
  )
}

const correctEntry = (v, props, setLoading) => {
  if (!props.corrected || props.isValid !== v) {
    setLoading(true)
    HomeStream.write(`com.hiome/gui/to/com.hiome/${props.sensorId}/entry`, {val: v, 'entry_ts': props.ts})
    message.success(`Thanks, I'll learn from this next time!`)
  }
}

const RevertLink = (props) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => setLoading(false), [props.isValid, props.corrected])
  return (
    <>
      <Button style={{margin: '0 10px 30px 0'}} size="large" icon="like" loading={loading}
        type={props.corrected && props.isValid ? "primary" : "dashed"} onClick={() => correctEntry(true, props, setLoading)}
      >Yes</Button>
      <Button style={{margin: '0 0 30px 10px'}} size="large" icon="dislike" loading={loading}
        type={props.corrected && !props.isValid ? "danger" : "dashed"} onClick={() => correctEntry(false, props, setLoading)}
      >No</Button>
    </>
  )
}

RevertLink.propTypes = {
  sensorId: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  corrected: PropTypes.bool.isRequired,
  ts: PropTypes.number.isRequired
}

const renderFilterBtn = (filter, objects) => {
  if (filter === '') return null
  const uuid = 'com.hiome/' + filter
  const txt = objects && uuid in objects ? `Filtered to ${objects[uuid].name.val}` : 'Filtered'
  return <div style={{marginBottom: '20px'}}>
    <Tag style={{maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}} closable={true} onClose={() => navigate('/door')}>
      <span style={{display: 'inline-block', maxWidth: '95%', textOverflow: 'ellipsis', overflow: 'hidden'}}>{txt}</span>
    </Tag>
  </div>
}

const EntryViewer = (props) => {
  const objectAttrs = useSWR(`${process.env.API_URL}api/1/hs/1/~/~/~`, url => fetcher(url).then(updateObjects))
  const { data } = useSWR(`${process.env.API_URL}api/1/entries/${props.filter}`, entryFetcher)

  // mqtt live updates
  useEffect(() => {
    const f = props.filter === '' ? '+' : props.filter
    const client = HomeStream.subscribe('hs/1/com.hiome/' + f + '/entry', function(m) {
      if (m.retain) return
      if (m.val === 'reverted' || m.val === 'validated') {
        mutate(`${process.env.API_URL}api/1/entries/${props.filter}`)
      } else {
        const p = {sensor_id: m.object_id, corrected: false, ...m.payload}
        mutate(`${process.env.API_URL}api/1/entries/${props.filter}`, async r => ([p, ...r]), true)
      }
    })
    return () => client.end()
  }, [props.filter])

  return (<>
      { renderFilterBtn(props.filter, objectAttrs.data) }

      { !data || !objectAttrs.data ? <div style={{textAlign: `center`,marginTop:'20px'}}><Spin size="large" /></div> :
        (data.length === 0 ? <Empty description="Nothing to see here!" /> : 
          data.map(d => renderLog(d, objectAttrs.data, props.debug))) }
    </>
  )
}

EntryViewer.propTypes = {
  filter: PropTypes.string,
  debug: PropTypes.bool
}

EntryViewer.defaultProps = {
  filter: '',
  debug: false
}

export default EntryViewer

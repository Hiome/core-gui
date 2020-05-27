import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { Avatar, Button, Empty, Spin, Tag } from 'antd'

import TimeAgo from '../TimeAgo'
import HomeStream from '../homestream'
import Collapsible from '../Collapsible'
import useSWRPages from '../LogViewer/use-swr-pages'

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

const entryFetcher = url => fetch(url).then(resp => resp.json()).then(resp => {
      return resp.map(m => {
        m.payload.sensor_id = m.sensor_id
        return m.payload
      })
    })

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

const trim = input => {
  if (input.length < 20) return input
  return input.substring(0, 15) + '...'
}

const renderLog = (row, objects, debug, currentFilter) => {
  if (!row || !objects) return null
  const o = objects[row.uuid] || {}
  if (!o.name) return null
  const template = row.entered ? `Somebody walked into ${objects['com.hiome/' + row.entered]?.name?.val || 'this doorway'}.` :
      `Somebody walked out of ${objects['com.hiome/' + row.exited]?.name?.val || 'this doorway'}.`
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
              <Link to={`/door/${row.sensor_id}/~~`}>{ o.name.val }</Link>
            </span>
            <span className="log-time">
              <TimeAgo time={row.ts} />
            </span>
          </div>
          <div className="log-content">
            <p className={row.is_valid ? 'valid-entry' : 'invalid-entry'}>{ template }</p>
            { row.corrected ? null : renderRevertLink(row, currentFilter) }
            { debug ? <Collapsible><pre>{ JSON.stringify(row.data, null, 2) }</pre></Collapsible> : null }
          </div>
        </div>
      </div>
    </div>
  )
}

const onRevert = (sensorId, ts, currentFilter) => {
  HomeStream.write(`com.hiome/gui/to/com.hiome/${sensorId}/entry`, {val: 'revert', 'entry_ts': ts})
  mutate(`${process.env.API_URL}api/1/entries/${props.filter}`)
}

const renderRevertLink = (row, currentFilter) => {
  if (!row.data.confidence) return null
  return <p>
    <span className={row.is_valid ? 'valid-confidence' : 'invalid-confidence'}>{row.is_valid ? 'Counted' : 'Ignored'} with {Math.floor(row.data.confidence*100)}% confidence</span>
    <Button type="link" title="Revert this entry" onClick={() => onRevert(row.sensor_id, row.ts, currentFilter)}>{row.is_valid ? '👎 This was not a valid entry, ignore it' : '👍 This was a valid entry, count it'}.</Button>
  </p>
}

const renderFilterBtn = (filter, objects) => {
  if (filter === '') return null
  const uuid = 'com.hiome/' + filter
  const txt = objects && uuid in objects ? `Entries are filtered to ${trim(objects[uuid].name.val)}` : 'Entries are filtered'
  return <div style={{marginBottom: '20px'}}>
    <Tag closable={true} onClose={() => navigate('/door')}>{txt}</Tag>
  </div>
}

const EntryViewer = (props) => {
  const objectAttrs = useSWR(`${process.env.API_URL}api/1/hs/1/~/~/~`, url => fetcher(url).then(updateObjects))
  const { data, isValidating } = useSWR(`${process.env.API_URL}api/1/entries/${props.filter}`, url => entryFetcher)

  // mqtt live updates
  useEffect(() => {
    const client = HomeStream.subscribe('hs/1/com.hiome/' + props.filter + '/entry', function(m) {
      if (m.retain) return
      m.payload.sensor_id = m.object_id
      mutate(`${process.env.API_URL}api/1/entries/${props.filter}`, async r => ([m.payload, ...r]), true)
    })
    return () => client.end()
  }, [props.filter])

  return (<>
      { renderFilterBtn(props.filter, objectAttrs.data) }

      { data.map(d => renderLog(d, objectAttrs.data, props.debug, props.filter)) }

      { !isValidating && !objectAttrs.isValidating && data?.length === 0 ? <Empty description="Nothing to see here!" /> : null }

      { isValidating || objectAttrs.isValidating ? <div style={{textAlign: `center`,marginTop:'20px'}}><Spin size="large" /></div> : null }
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

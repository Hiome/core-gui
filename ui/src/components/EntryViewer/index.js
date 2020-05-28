import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect } from 'react'
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

const trim = input => {
  if (input.length < 20) return input
  return input.substring(0, 15) + '...'
}

const renderLog = (row, objects, debug) => {
  if (!row || !objects || !row.confidence) return null
  const o = objects['com.hiome/'+row.sensor_id] || {}
  if (!o.name) return null
  let template = null
  if (row.entered && objects['com.hiome/' + row.entered] && objects['com.hiome/' + row.entered].name) {
    template = `Somebody walked into ${objects['com.hiome/' + row.entered].name.val}.`
  } else if (row.exited && objects['com.hiome/' + row.exited] && objects['com.hiome/' + row.exited].name) {
    template = `Somebody walked out of ${objects['com.hiome/' + row.exited].name.val}.`
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
            <p className={row.is_valid ? 'valid-entry' : 'invalid-entry'} style={{color: `rgba(0, 0, 0, ${row.is_valid ? 1 : row.confidence})`}}>{ template }</p>
            <div className={row.is_valid ? 'valid-confidence' : 'invalid-confidence'}>
              {row.is_valid ? 'Counted with' : 'Ignored due to'} {Math.floor(row.confidence*100)}% confidence.
            </div>
            <RevertLink sensorId={row.sensor_id} isValid={row.is_valid} corrected={row.corrected} ts={row.ts} />
            { debug ? <Collapsible><pre>{ JSON.stringify(row, null, 2) }</pre></Collapsible> : null }
          </div>
        </div>
      </div>
    </div>
  )
}

const RevertLink = (props) => {
  if (props.corrected) {
    return <p>Manually marked as {props.is_valid ? 'correct' : 'invalid'}.</p>
  }

  const btnIcon = props.isValid ?
    <svg ariaLabel="warning" height='0.7em' width='0.7em' style={{marginRight: '5px'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 847 847" x="0px" y="0px" fillRule="evenodd" clipRule="evenodd"><g><polygon fill="#ec4c47" points="423,304 707,20 827,140 543,423 827,707 707,827 423,543 140,827 20,707 304,423 20,140 140,20 "></polygon></g></svg> :
    <svg ariaLabel="good" height='1em' width='1em' style={{marginBottom: '-1px', marginRight: '5px'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 847 847" x="0px" y="0px" fillRule="evenodd" clipRule="evenodd"><g><path fill="#47b881" d="M299 522l396 -396c18,-18 47,-18 65,0l51 51c18,18 18,47 0,64l-479 480c-18,18 -47,18 -65,0l-232 -232c-17,-17 -17,-46 0,-64l52 -51c17,-18 46,-18 64,0l148 148z"></path></g></svg>

  return <p style={{marginLeft:'-15px'}}>
    <Button type="link" title="Revert this entry" onClick={() => {
      HomeStream.write(`com.hiome/gui/to/com.hiome/${props.sensorId}/entry`, {val: 'revert', 'entry_ts': props.ts})
      message.success(`Thanks, I'll learn from this next time!`)
    }}>
      {btnIcon} { props.isValid ? 'Not a valid entry, ignore it' : 'Valid entry, count it' }.
    </Button>
  </p>
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
  const txt = objects && uuid in objects ? `Entries are filtered to ${trim(objects[uuid].name.val)}` : 'Entries are filtered'
  return <div style={{marginBottom: '20px'}}>
    <Tag closable={true} onClose={() => navigate('/door')}>{txt}</Tag>
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
      if (m.val === 'reverted') {
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

import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect, useRef } from 'react'
import useSWR, { useSWRPages, mutate } from '@ykzts/swr'
import { Avatar, Button, Empty, Tooltip, Spin } from 'antd'
import VirtualScrollerComponent, { Viewport } from '@liximomo/react-virtual-scroller'

import Battery from '../Battery'
import TimeAgo from "../TimeAgo"
import HomeStream from '../homestream'

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

/**
 * Produces a function which uses template strings to do simple interpolation from objects.
 * Adapted from https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
 * 
 * Example: renderTemplate('The occupancy is now ${count}!', {count: 0}) //=> "The occupancy is now 0!"
 */
const templateFnCache = {}

const renderTemplate = (template, vals, obj) => {
  let fn = templateFnCache[template]

  if (!fn) {
    // randomly generate a key for each fn so that attacker cannot bypass final replace with a predictable pattern
    const key = `key${Math.floor(Math.random() * 1000)}`
    const self = `self${Math.floor(Math.random() * 1000)}`
    // Replace ${expressions} (etc) with ${key.expressions}
    const sanitized = template
      // strip out unsafe characters ;{()
      // allow period and brackets to enable nested templates like extra.confidence or extra['confidence']
      // allow other non-alphanumeric characters to enable ternary operators like ${count === 1 ? 'is' : 'are'}
      // "$msg" can be used as a placeholder to reference the current message, like ${count > 0 ? $msg.pos : $msg.neg}
      // "$self" can be used as a placeholder to reference the current object like ${$self.battery}
      .replace(/\$\{([\s]*[^;\{\(\)]+[\s]*)\}/g, function(_, match) {
        match = match.trim().replace(/(\$msg)/g, key).replace(/(\$self)/g, self)
        if (match.startsWith(key) || match.startsWith(self)) return `\$\{${match}\}`
        return `\$\{${key}.${match}\}`
      })
      // Afterwards, replace anything that's not ${key.expressions}' (etc) with a blank string
      .replace(new RegExp(`(\$\{(?!(?:${key}|${self}))[^}]+\})`,'g'), '')

    fn = Function(key, self, `return \`${sanitized}\``)

    // update cache
    templateFnCache[template] = fn
  }

  return fn(vals, obj)
}

const templates = (msg) => {
  switch([msg.attribute, msg.data.tmpl || '*'].join('/')) {
    case 'occupancy/negative':
      return "Oops, I made a mistake somewhere."
    case 'occupancy/siphoned':
      return "Hiome corrected my occupancy to ${val} ${val === 1 ? 'person' : 'people'}."
    case 'occupancy/cleared':
      return "Hiome cleared my occupancy to ${val} due to inactivity."
    case 'occupancy/decayed':
      return "Hiome reduced my occupancy to ${val} ${val === 1 ? 'person' : 'people'} due to inactivity."
    case 'occupancy/reset':
      return "Somebody changed my occupancy to ${val} ${val === 1 ? 'person' : 'people'}."
    case 'occupancy/*':
      return "There ${val === 1 ? 'is' : 'are'} now ${val} ${val === 1 ? 'person' : 'people'} in here."
    case 'entry/entry_exit':
      return "Somebody walked into @com.hiome/${entered}."
    case 'entry/entry_only':
      return "Somebody entered from outside."
    case 'entry/exit_only':
      return "Somebody went outside."
    case 'entry/revert':
      return "Somebody reverted a previous entry."
    case 'door/*':
      return "The door is now ${val}."
    case 'position/sunrise':
      return "Good morning!"
    case 'position/sunset':
      return "Have a good evening!"
    case 'connected/disconnected':
      return "Help, I haven't been seen in a while. I think I'm disconnected!"
    case 'connected/reconnected':
      return "I'm online! It feels good to be back."
    default:
      return null
  }
}

const addLinksToText = (txt, objects) => {
  const parts = txt.split(/(@[\w\.\-]+\/[\w\-]+)/)
  return parts.map(function(w) {
    if (w.startsWith('@') && w.indexOf('/') !== -1) {
      const uuid = w.substr(1)
      if (uuid in objects) {
        return <Link key={`${uuid}${txt}`} to={`/hs/1/${uuid}/~~`} className="atTag">{ objects[uuid].name.val }</Link>
      }
    }
    return w
  })
}

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

const batteryText = (label) => {
  switch(label) {
    case 'full':
      return 'The battery is fully charged.'
    case 'high':
      return 'The battery level is high.'
    case 'normal':
      return 'The battery level is good.'
    case 'low':
      return 'The battery is running low. Recharge soon!'
    case 'critical':
      return 'Recharge battery immediately!'
    default:
      return 'The battery level is unknown.'
  }
}

const batteryStatus = (battery) => {
  if (!battery) return null
  return <Battery label={battery.label} />
}

const renderable = (row, objects, knownTs, debug) => {
  if (!row || !objects) return null
  const o = objects[row.uuid] || {}
  if (!o.name) return null
  const template = templates(row)
  if (!template) return null
  return true
}

const renderLog = (row, objects, knownTs, debug) => {
  if (!row || !objects) return null
  const o = objects[row.uuid] || {}
  if (!o.name) return null
  const template = templates(row)
  if (!template) return null
  const knownContext = row.context_ts ? knownTs.indexOf(row.context_topic + '/' + row.context_ts) !== -1 : false
  return (
    <div className={`log-line ${knownContext ? 'log-contextual' : ''}`}>
      <div className="log-avatar">
        <Avatar style={{ backgroundColor: colorize(o.name.val) }} shape="square" size="large">
          {smartTrim(o.name.val)}
        </Avatar>
      </div>
      <div className="log-message">
        <div className="log-meta">
          <span className="log-author">
            <Link to={`/hs/1/${row.uuid}/~~`}>{ o.name.val }</Link>
          </span>
          <span className="log-time">
            <TimeAgo time={row.ts} />
          </span>
          <span className="log-battery">
            {batteryStatus(o.battery)}
          </span>
        </div>
        <div className="log-content">
          <p>
            { addLinksToText(renderTemplate(template, row.data, o), objects) }
          </p>
        </div>
      </div>
    </div>
  )
}

const LogViewer = (props) => {
  const objectAttrs = useSWR(`${process.env.API_URL}api/1/hs/1/~/~/~`, url => fetcher(url).then(updateObjects))
  const {
    pages,
    pageSWRs,
    isLoadingMore,
    isReachingEnd,
    loadMore
  } = useSWRPages(
    `${props.topic}/${props.day}`, // key of this page
    ({ offset, withSWR }) => {
      withSWR(
        useSWR(`${process.env.API_URL}api/1/hs/1/${props.topic}/${props.day}?limit=300&reverse=true&until=${offset || (props.day + 86399999)}`, fetcher)
      )
      return <></>
    },
    swr => swr.data.length >= 300 ? (swr.data[swr.data.length - 1].ts - 1) : null,
    [props.topic, props.day]
  )

  // mqtt live updates
  useEffect(() => {
    if (props.day >= new Date().setHours(0,0,0,0)) {
      const client = HomeStream.subscribe('hs/1/' + props.topic.replace(/~~/g, '#').replace(/~/g,'+'), function(m) {
        if (m.retain || m.ts < props.day) return
        m.uuid = m.namespace + '/' + m.object_id
        mutate(`${process.env.API_URL}api/1/hs/1/${props.topic}/${props.day}?limit=300&reverse=true&until=${props.day + 86399999}`, async h => ([m, ...h]))
        if (m.attribute !== 'to') mutate(`${process.env.API_URL}api/1/hs/1/~/~/~`, ( async attrs => updateObjects(m, attrs) ), false)
      })
      return () => client.end()
    }
  }, [props.topic, props.day])

  const vp = useRef(new Viewport(window))
  const items = pageSWRs.reduce((x,y) => y ? x.concat(y.data) : x, []).filter(x => renderable(x, objectAttrs.data, [], false))
  const isLoading = isLoadingMore || pageSWRs.length === 0 || (items.length === 0 && objectAttrs.isValidating)

  return (<>
      { pages }

      { items.length === 0 ? (isLoading ? null : <Empty description="Nothing to see here!" />) : 
        <VirtualScrollerComponent
          items={items}
          renderItem={(item, index) => renderLog(item, objectAttrs.data, [], false)}
          identityFunction={item => `${item.topic}/${item.ts}`}
          viewport={vp.current}
          assumedItemHeight={100}
          onNearEnd={loadMore}
        />
      }

      { isLoading || isReachingEnd || items.length === 0 ? null :
          <Button icon="reload" onClick={loadMore} type="primary">Load More</Button>
      }

      { isLoading ? <div style={{textAlign: `center`,marginTop:'20px'}}><Spin size="large" /></div> : null }
    </>
  )
}

LogViewer.propTypes = {
  topic: PropTypes.string.isRequired,
  day: PropTypes.number.isRequired
}

export default LogViewer

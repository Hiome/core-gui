import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import { Avatar, Button, Empty, Spin, Tag } from 'antd'

import Battery from '../Battery'
import TimeAgo from "../TimeAgo"
import HomeStream from '../homestream'
import Collapsible from '../Collapsible'

import useSWRPages from './use-swr-pages'
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
  if (msg.attribute === 'occupancy') {
    switch(msg.data.tmpl) {
      case 'negative':
        return "Oops, I made a mistake somewhere."
      case 'siphoned':
        return "Hiome corrected my occupancy to ${val} ${val === 1 ? 'person' : 'people'}."
      case 'cleared':
        return "Hiome cleared my occupancy to ${val} due to inactivity."
      case 'decayed':
        return "Hiome reduced my occupancy to ${val} ${val === 1 ? 'person' : 'people'} due to inactivity."
      case 'reset':
        return "Somebody changed my occupancy to ${val} ${val === 1 ? 'person' : 'people'}."
      default:
        return "There ${val === 1 ? 'is' : 'are'} now ${val} ${val === 1 ? 'person' : 'people'} in here."
    }
  } else if (msg.attribute === 'entry') {
    switch(msg.data.tmpl) {
      case 'entry_exit':
        return "Somebody walked into @com.hiome/${entered}."
      case 'entry_only':
        return "Somebody entered from outside."
      case 'exit_only':
        return "Somebody went outside."
      case 'revert':
        return "Somebody reverted a previous entry."
      default:
        return null
    }
  } else if (msg.attribute === 'door') {
    return "The door is ${val}."
  } else if (msg.attribute === 'position') {
    switch(msg.data.tmpl) {
      case 'sunrise':
        return "Good morning!"
      case 'sunset':
        return "Have a good evening!"
      default:
        return null
    }
  } else if (msg.attribute === 'connected') {
    switch(msg.data.tmpl) {
      case 'disconnected':
        return "Help, I haven't been seen in a while. I think I'm disconnected!"
      case 'reconnected':
        return "I'm online! It feels good to be back."
      default:
        return null
    }
  }
  return null
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

const trim = input => {
  if (input.length < 20) return input
  return input.substring(0, 15) + '...'
}

const batteryStatus = (battery) => {
  if (!battery) return null
  return <Battery label={battery.label} />
}

const renderable = (row, objects, debug) => {
  if (!row || !objects) return null
  const o = objects[row.uuid] || {}
  if (!o.name) return null
  if (debug) return true
  const template = templates(row)
  if (!template) return null
  return true
}

const renderLog = (row, objects, debug) => {
  if (!row || !objects) return null
  const o = objects[row.uuid] || {}
  if (!o.name) return null
  const template = templates(row)
  if (!template && !debug) return null
  return (
    <div className="log-container" key={`${row.topic}/${row.ts}`}>
      <div className="log-line">
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
              { template ? addLinksToText(renderTemplate(template, {...row, ...row.data}, o), objects) : row.topic.substr(5) }
            </p>
            { debug ? <Collapsible><pre>{ JSON.stringify(row.data, null, 2) }</pre></Collapsible> : null }
          </div>
        </div>
      </div>
      
        { renderContext(row, objects, debug) }
    </div>
  )
}

const renderContext = (row, objects, debug) => {
  const arr = []
  for (let r of row.contexts) {
    const o = objects[r.uuid] || {}
    if (!o.name) continue
    const template = templates(r)
    if (!template && !debug) continue
    arr.push(
      <div className="log-line" key={`${r.topic}/${r.ts}`}>
        <div className="log-avatar">
          <Avatar style={{ backgroundColor: colorize(o.name.val) }} shape="square" size="large">
            {smartTrim(o.name.val)}
          </Avatar>
        </div>
        <div className="log-message">
          <div className="log-meta">
            <span className="log-author">
              <Link to={`/hs/1/${r.uuid}/~~`}>{ o.name.val }</Link>
            </span>
            <span className="log-time">
              <TimeAgo time={r.ts} />
            </span>
            <span className="log-battery">
              {batteryStatus(o.battery)}
            </span>
          </div>
          <div className="log-content">
            <p>
              { template ? addLinksToText(renderTemplate(template, {...r, ...r.data}, o), objects) : r.topic.substr(5) }
            </p>
            { debug ? <Collapsible><pre>{ JSON.stringify(r.data, null, 2) }</pre></Collapsible> : null }
          </div>
        </div>
      </div>
    )
  }
  if (arr.length) return <div className="log-contexts">{arr}</div>
  return arr
}

const renderFilterBtn = (topic, objects) => {
  if (topic.startsWith('~/~/~')) return null
  let uuid = topic.split('/')
  uuid = uuid[0] + '/' + uuid[1]
  const txt = objects && uuid in objects ? `Logs are filtered to ${trim(objects[uuid].name.val)}` : 'Logs are filtered'
  return <div style={{marginBottom: '20px'}}>
    <Tag closable={true} onClose={() => navigate('/hs/1/~/~/~~')}>{txt}</Tag>
  </div>
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
      const {data} = withSWR(
        useSWR(`${process.env.API_URL}api/1/hs/1/${props.topic}/${props.day}?limit=300&reverse=true&until=${offset || (props.day + 86399999)}`, fetcher)
      )
      if (!data) return null
      return data.reduceRight(([i,contexts], x) => {
        if (x.context_ts) {
          const key = x.context_topic + '/' + x.context_ts
          if (key in contexts) {
            contexts[key].unshift(x)
          } else {
            i.unshift(x)
          }
        } else {
          // otherwise add it to items array
          i.unshift(x)
          contexts[x.topic + '/' + x.ts] = []
        }
        return [i, contexts]
      }, [[], {}]).reduceRight((contexts,i) => {
        if (Array.isArray(i)) {
          i.forEach(x => {
            x.contexts = (contexts[x.topic + '/' + x.ts] || []).reverse()
          })
        }
        return i
      }, []).map(i => renderLog(i, objectAttrs.data, props.debug))
    },
    swr => swr.data.length >= 300 ? (swr.data[swr.data.length - 1].ts - 1) : null,
    [props.topic, props.day, props.debug, objectAttrs.data && Object.keys(objectAttrs.data).length]
  )

  // mqtt live updates
  useEffect(() => {
    if (props.day >= new Date().setHours(0,0,0,0)) {
      const client = HomeStream.subscribe('hs/1/' + props.topic.replace(/~~/g, '#').replace(/~/g,'+'), function(m) {
        if (m.retain || m.ts < props.day) return
        m.uuid = m.namespace + '/' + m.object_id
        mutate(`${process.env.API_URL}api/1/hs/1/${props.topic}/${props.day}?limit=300&reverse=true&until=${props.day + 86399999}`,
          async h => ([m, ...h]), templates(m))
        if (m.attribute !== 'to') mutate(`${process.env.API_URL}api/1/hs/1/~/~/~`, async attrs => updateObjects(m, attrs), false)
      })
      return () => client.end()
    }
  }, [props.topic, props.day])

  const hasItems = pageSWRs.some(p => p.data ? p.data.some(x => renderable(x, objectAttrs.data, props.debug)) : false)
  // const hasItems = useMemo(() => (
  // ), [props.topic, props.day, props.debug, pageSWRs.length, objectAttrs.data && Object.keys(objectAttrs.data).length])
  const isLoading = isLoadingMore || pageSWRs.length === 0 || (!hasItems && objectAttrs.isValidating)

  if (!hasItems && !isReachingEnd && !isLoading) loadMore()

  // infinite scroll
  const $loadMoreButton = useRef(null);
  useEffect(() => {
    if ($loadMoreButton.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) loadMore()
      }, { rootMargin: '200px' })
      const btn = $loadMoreButton.current
      observer.observe(btn)
      return () => {
        observer.unobserve(btn)
      }
    }
  }, [$loadMoreButton.current, loadMore])

  return (<>
      { renderFilterBtn(props.topic, objectAttrs.data) }

      { pages }

      { !isLoading && !hasItems ? <Empty description="Nothing to see here!" /> : null }

      { isLoading || !hasItems || isReachingEnd ? null :
          <div ref={$loadMoreButton}><Button icon="reload" onClick={loadMore} type="primary">Load More</Button></div>
      }

      { isLoading ? <div style={{textAlign: `center`,marginTop:'20px'}}><Spin size="large" /></div> : null }
    </>
  )
}

LogViewer.propTypes = {
  topic: PropTypes.string.isRequired,
  day: PropTypes.number.isRequired,
  debug: PropTypes.bool
}

LogViewer.defaultProps = {
  debug: false
}

export default LogViewer

import { Link } from "gatsby"
import { navigate } from '@reach/router'
import React, { Component, useEffect, useRef } from 'react'
import useSWR, { useSWRPages, mutate } from 'swr'
import { Button, Empty, Spin } from 'antd'

import LayoutPage from "../components/LayoutPage"
import SEO from "../components/seo"
import strftime from "../components/strftime"
import TimeAgo from "../components/TimeAgo"
import HomeStream from '../components/homestream'

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

// object attribute reducer
const updateObjects = (newObjs, acc) => {
  if (!Array.isArray(newObjs)) newObjs = Array(newObjs)
  if (!acc) acc = {}
  for (let m of newObjs) {
    let o = acc[m.uuid]
    if (o === undefined) o = {}
    o[m.attribute] = m.val
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

const renderTemplate = (template, vals) => {
  let fn = templateFnCache[template]

  if (!fn) {
    // randomly generate a key for each fn so that attacker cannot bypass final replace with a predictable pattern
    const key = `key${Math.floor(Math.random() * 1000)}`
    // Replace ${expressions} (etc) with ${key.expressions}
    const sanitized = template
      // strip out unsafe characters ;{()
      // allow period and brackets to enable nested templates like extra.confidence or extra['confidence']
      // allow other non-alphanumeric characters to enable ternary operators like ${count === 1 ? 'is' : 'are'}
      // "$msg" can be used as a placeholder to reference the key, like ${count > 0 ? $msg.pos : $msg.neg}
      .replace(/\$\{([\s]*[^;\{\(\)]+[\s]*)\}/g, function(_, match) {
        match = match.trim().replace(/(\$msg)/g, key)
        if (match.startsWith(key)) return `\$\{${match}\}`
        return `\$\{${key}.${match}\}`
      })
      // Afterwards, replace anything that's not ${key.expressions}' (etc) with a blank string
      .replace(new RegExp(`(\$\{(?!${key})[^}]+\})`,'g'), '')

    fn = Function(key, `return \`${sanitized}\``)

    // update cache
    templateFnCache[template] = fn
  }

  return fn(vals)
}

const templates = (msg) => {
  switch([msg.attribute, msg.data.template || '*'].join('/')) {
    case 'occupancy/*':
      return "There ${val === 1 ? 'is' : 'are'} now ${val} ${val === 1 ? 'person' : 'people'} in here."
    case 'entry/*':
      return "Somebody walked into @com.hiome/${entered} from @com.hiome/${exited}."
    case 'door/*':
      return "The door is now ${val}."
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
        return <Link key={`${uuid}${txt}`} to={`/hs/1/${uuid}/~~`}>{ objects[uuid].name }</Link>
      }
    }
    return w
  }.bind(this))
}

const renderLog = (row, objects, debug) => {
  const o = objects[row.uuid] || {}
  if (!o.name) return null
  const template = templates(row)
  if (!template) return null
  return (
    <div key={`${row.topic}/${row.ts}`} className="log-row">
      <div className="log-name">
        <Link to={`/hs/1/${row.uuid}/~~`}>{ o.name }</Link>
        <div className="timeago" style={{
          display: `inline-block`,
          width: debug ? `7.5rem` : `4.5rem`,
          fontSize: `0.8rem`,
          color: `#ccc`,
          marginLeft: `1rem`
        }}><TimeAgo time={row.ts} debug={debug} /></div>
      </div>
      <p>
        { addLinksToText(renderTemplate(template, row.data), objects) }
      </p>
    </div>
  )
}

const HomeStreamPage = (props) => {
  const objectAttrs = useSWR(`${process.env.API_URL}api/1/hs/1/~/~/~`, url => fetcher(url).then(updateObjects))

  const [topic, day] = currentTopic(props.location.pathname)
  const debug = debugging(props.location.search)

  const {
    pages,
    pageSWRs,
    isLoadingMore,
    isReachingEnd,
    isEmpty,
    loadMore
  } = useSWRPages(
    topic + '/' + day, // key of this page
    ({ offset, withSWR }) => {
      const { data } = withSWR(
        useSWR(`${process.env.API_URL}api/1/hs/1/${topic}/${day}?limit=1000&reverse=true&until=${offset || (day + 86399999)}`, fetcher)
      )
      if (!data) return null
      return data.map(h => renderLog(h, objectAttrs.data || {}, debug))
    },
    swr => swr.data.length >= 1000 ? (swr.data[swr.data.length - 1].ts - 1) : null,
    [topic, day, objectAttrs.data, debug]
  )

  // mqtt live updates
  useEffect(() => {
    if (day >= new Date().setHours(0,0,0,0)) {
      const client = HomeStream.subscribe('hs/1/' + topic.replace(/~~/g, '#').replace(/~/g,'+'), function(m) {
        if (m.retain || m.ts < day) return
        m.uuid = m.namespace + '/' + m.object_id
        mutate(`${process.env.API_URL}api/1/hs/1/${topic}/${day}?limit=1000&reverse=true&until=${day + 86399999}`, async h => ([m, ...h]))
        if (m.attribute !== 'to') mutate(`${process.env.API_URL}api/1/hs/1/~/~/~`, ( async attrs => updateObjects(m, attrs) ), false)
      })
      return () => client.end()
    }
  }, [topic, day])

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

  // deal with SRW oddities
  const stillLoading = pageSWRs.length === 0 || (!isEmpty && pageSWRs.length === 1 && !pageSWRs[0].data)
  const isEmptyFrd = isEmpty || (!stillLoading && pageSWRs.every(x => !x.data || !x.data.length))

  return (<LayoutPage>
      <SEO title="HomeStream" />
      <h1>{ strftime('%A, %B %e%t', new Date(day)) }</h1>
      { stillLoading ? <div style={{textAlign: `center`}}><Spin size="large" /></div> : null }
      { isEmptyFrd ? <Empty description="Nothing to see here!" /> : null }
      { pages }
      { stillLoading || isReachingEnd || isEmptyFrd ? null :
          <div ref={$loadMoreButton}>
            <Button icon="reload" onClick={loadMore} type="primary" loading={isLoadingMore}>Load More</Button>
          </div>
      }
      <div className="pagination">
        <Link to={`/hs/1/${topic}/${day - 86400000}`} className="newer">
          &#x2190; &nbsp; {strftime('%A, %B %e%t', new Date(day - 86400000))}
        </Link>

        <Link to={`/hs/1/${topic}/${day + 86400000}`} className={`older ${day >= new Date().setHours(0,0,0,0) ? 'hidden' : ''}`}>
          {strftime('%A, %B %e%t', new Date(day + 86400000))} &nbsp; &#x2192;
        </Link>
      </div>
    </LayoutPage>
  )
}

export default HomeStreamPage

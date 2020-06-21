import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect, useRef } from 'react'
import useSWR from 'swr'
import { Avatar, Button, Empty, Spin, Tag, Menu, Dropdown, Icon } from 'antd'

import Battery from '../Battery'
import TimeAgo from "../TimeAgo"
import HomeStream from '../homestream'
import Collapsible from '../Collapsible'
import { useSWRInfinite } from './use-swr-infinite'

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
        return "Hmm I was already empty."
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
        return "Somebody walked into @com.hiome/${entered} from @com.hiome/${exited}."
      case 'entry_only':
        return "Somebody entered from outside."
      case 'exit_only':
        return "Somebody went outside."
      case 'revert':
        return "Somebody reverted a previous entry."
      case 'auto_revert':
        return "Hiome reverted a previous entry."
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
  } else if (msg.attribute === 'updating') {
    switch(msg.data.tmpl) {
      case 'start':
        return "I am updating your sensors to the latest firmware!"
      case 'stop':
        return "All done updating!"
      case 'retry_later':
        return "Some sensors didn't respond. I'll try again later..."
      default:
        return null
    }
  } else if (msg.attribute === 'version') {
    switch(msg.data.tmpl) {
      case 'updated':
        return "I am now running firmware ${val}"
      default:
        return null
    }
  } else if (msg.attribute === 'battery') {
    switch(msg.data.tmpl) {
      case 'done_charging':
        return "I am done recharging!"
      default:
        return null
    }
  } else if (msg.attribute === 'connected') {
    switch(msg.data.tmpl) {
      case 'disconnected':
        return "Help, I haven't been seen in a while. I think I'm disconnected!"
      case 'reconnected':
        return "I'm online! It feels good to be back."
      case 'new_device':
        return "I just connected for the first time! You have a nice home."
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

const menuClick = (key, sensor_id) => {
  if (key === 'door') navigate('/door/'+sensor_id)
  else if (key === 'settings') navigate('/settings/door/'+sensor_id)
}

const doorMenu = (sensor_id, attr) => {
  if (attr === 'entry' || attr === 'door') {
    const menu = <Menu onClick={({key}) => menuClick(key, sensor_id)}>
        <Menu.Item key="door">
          <Icon type="like" /> Calibrate Door
        </Menu.Item>
        <Menu.Item key="settings">
          <Icon type="setting" /> Settings
        </Menu.Item>
      </Menu>
    return (<Dropdown overlay={menu} placement="bottomRight" trigger={["click", "hover"]}>
      <Button icon="ellipsis" size="small" shape="circle" ghost style={{color: '#000', marginRight: '0.5em'}} />
    </Dropdown>)
  }
  return null
}

const colorizedCache = {}

const colorize = (input) => {
  let c = colorizedCache[input]
  if (!c) {
    const stringHexNumber = (
      parseInt(parseInt(input, 36).toExponential().slice(2,-5), 10) & 0xFFFFFF
    ).toString(16).toUpperCase()
    c = '#' + ('000000' + stringHexNumber).slice(-6)
    colorizedCache[input] = c
  }
  return c
}

const smartTrim = (input) => {
  if (input.length < 9) return input
  input = input.split(" ")[0]
  return input.substring(0, 9)
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
            {doorMenu(row.object_id, row.attribute)}
            <span className="log-battery">
              { o.battery ? <Battery label={o.battery.label} /> : null }
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
  if (!topic || topic.startsWith('~/~/~')) return null
  let uuid = topic.split('/')
  uuid = uuid[0] + '/' + uuid[1]
  const txt = objects && uuid in objects ? `Filtered to ${objects[uuid].name.val}` : 'Filtered'
  return <div style={{marginBottom: '20px'}}>
    <Tag style={{maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}} closable={true} onClose={() => navigate('/hs/1/~/~/~~')}>
      <span style={{display: 'inline-block', maxWidth: '95%', textOverflow: 'ellipsis', overflow: 'hidden'}}>{txt}</span>
    </Tag>
  </div>
}

const LogViewer = (props) => {
  const objectAttrs = useSWR(`${process.env.API_URL}api/1/hs/1/~/~/~`, url => fetcher(url).then(updateObjects))
  const events = useSWRInfinite(
    (index, prevData) => {
      if (prevData && prevData < 300) return null
      const offset = prevData ? (prevData[prevData.length - 1].ts - 1) : (props.day + 86399999)
      return `${process.env.API_URL}api/1/hs/1/${props.topic}/${props.day}?limit=300&reverse=true&until=${offset}`
    },
    fetcher,
    {revalidateAllPages: true}
  )

  const data = events.data ? events.data.flat().reduce(([i,contexts], x) => {
        i.push(x)
        contexts[x.topic + '/' + x.ts] = []
        return [i, contexts]
      }, [[], {}]).reduceRight(([_t, contexts], i) => {
        if (Array.isArray(i)) {
          return i.reduce(([new_i, c], x) => {
            if (x.context_ts) {
              const key = x.context_topic + '/' + x.context_ts
              if (key in c) {
                c[key].push(x)
              } else {
                new_i.push(x)
              }
            } else {
              new_i.push(x)
            }
            return [new_i, c]
          }, [[], contexts])
        }
        return [[], i]
      }, [[], {}]).reduceRight((contexts,i) => {
        if (Array.isArray(i)) {
          i.forEach(x => {
            x.contexts = (contexts[x.topic + '/' + x.ts] || []).reverse()
          })
        }
        return i
      }, []) : []

  // mqtt live updates
  useEffect(() => {
    if (props.day >= new Date().setHours(0,0,0,0)) {
      const client = HomeStream.subscribe('hs/1/' + props.topic.replace(/~~/g, '#').replace(/~/g,'+'), function(m) {
        if (m.retain) return
        // m.uuid = m.namespace + '/' + m.object_id
        events.mutate()
        // if (m.attribute !== 'to') {
        //   objectAttrs.mutate()
        // }
      })
      return () => client.end()
    }
  }, [props.topic, props.day])

  const isEmpty = !data.some(x => renderable(x, objectAttrs.data, props.debug))
  const isLoadingMore = !events.data || typeof events.data[events.page - 1] === "undefined" || (isEmpty && !objectAttrs.data)
  const isReachingEnd = events.data && events.data[events.data.length - 1] && events.data[events.data.length - 1].length < 300

  if (isEmpty && !isReachingEnd && !isLoadingMore) events.setPage(p => p + 1)

  // infinite scroll
  const $loadMoreButton = useRef(null)
  useEffect(() => {
    if ($loadMoreButton.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) events.setPage(p => p + 1)
      }, { rootMargin: '2000px' })
      const btn = $loadMoreButton.current
      observer.observe(btn)
      return () => {
        observer.unobserve(btn)
      }
    }
  }, [$loadMoreButton.current, events.setPage])

  return (<>
      { renderFilterBtn(props.topic, objectAttrs.data) }

      { data.map(i => renderLog(i, objectAttrs.data, props.debug)) }

      { isEmpty && !isLoadingMore ? <Empty description="Nothing to see here!" /> : null }

      { isLoadingMore || isEmpty || isReachingEnd ? null :
          <div ref={$loadMoreButton}><Button icon="reload" onClick={() => events.setPage(p => p + 1)} type="primary">Load More</Button></div>
      }

      { isLoadingMore ? <Spin size="large" style={{textAlign: `center`, marginTop: `20px`, display: `block`}} /> : null }
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

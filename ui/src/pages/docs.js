import React, {useEffect, useState} from 'react'
import useSwr from 'swr'
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco'
import { Layout as AntLayout, Anchor } from 'antd'

import Layout from '../components/Layout'
import HomeStream from '../components/homestream'
import Collapsible from '../components/Collapsible'

import './docs.css'

SyntaxHighlighter.registerLanguage('javascript', js)

const { Content, Sider } = AntLayout
const { Link } = Anchor

const renderEvents = (events) => {
  return events.map(e => <div key={`${e.topic}/${e.ts}`} style={{marginBottom: '10px'}}>
    <strong>{e.topic}</strong><br/><SyntaxHighlighter language="javascript" style={docco}>{e.payload}</SyntaxHighlighter>
  </div>)
}

const renderFilteredEvents = (topics, f) => {
  return Object.values(topics).filter(x => x.attribute === f).map(e => <div key={`${e.topic}/${e.ts}`} style={{marginBottom: '10px'}}>
    <strong>{e.topic}</strong><br/><SyntaxHighlighter language="javascript" style={docco}>{e.payload}</SyntaxHighlighter>
  </div>)
}

const DocsPage = () => {
  const { data } = useSwr(`${process.env.API_URL}api/1/rooms`, url => fetch(url).then(r => r.json()))
  const room = data && data.length ? data[0] : {id: 'room_43432590', name: 'Bedroom', occupancy_count: 0}

  const [ev, setEvents] = useState([])
  const [topics, setTopics] = useState({})

  useEffect(() => {
    const client = HomeStream.subscribe('hs/1/#', function(m) {
      if (m.attribute !== 'to') {
        console.log("topic: " + m.topic)
        console.log(m.data)
        console.log(`${m.namespace}/${m.object_id} ${m.attribute} is ${m.val}`)
        console.log("")
      }
      setEvents(e => [m, ...e.slice(0, 100)])
      setTopics(t => {
        t[m.topic] = m
        return t
      })
    })
    return () => client.end()
  }, [])

  return <Layout title="API Docs">
    <AntLayout style={{backgroundColor: '#fff'}}>
      <Sider style={{backgroundColor: '#fff', height: '100vh'}} width={170} className="doc-sider">
        <Anchor>
          <Link href="#mqtt" title="MQTT">
            <Link href="#mqtt-topics" title="Topics" />
            <Link href="#mqtt-payload" title="Payload" />
            <Link href="#mqtt-sub" title="Subscribing">
              <Link href="#mqtt-ledger" title="Ledger" />
            </Link>
            <Link href="#mqtt-pub" title="Publishing">
              <Link href="#mqtt-tmpl" title="Templates" />
              <Link href="#mqtt-context" title="Context" />
              <Link href="#mqtt-dm" title="Direct Message" />
            </Link>
          </Link>
          <Link href="#events" title="Hiome Events">
            <Link href="#events-occupancy" title="Occupancy" />
            <Link href="#events-entry" title="Entry" />
            <Link href="#events-door" title="Door" />
            <Link href="#events-battery" title="Battery" />
            <Link href="#events-name" title="Name" />
            <Link href="#events-version" title="Version" />
            <Link href="#events-connected" title="Connected" />
            <Link href="#events-updating" title="Updating" />
            <Link href="#events-sun" title="Sun Position" />
          </Link>
          <Link href="#timer" title="Timer" />
          <Link href="#version" title="Version" />
          <Link href="#debugging" title="Debugging" />
        </Anchor>
      </Sider>
      <Content>
      <div className="explainer">
        Everything about Hiome is designed with the firm principle that your data belongs to you.
        If you're a developer, that means being able to build anything you want without running into artificial walls.
        Let's look at how you can access your data and build something cool!
      </div>

      <p>Hiome is built on top of HomeStream, a local events pipeline and ledger for your home. You can think of it like a Slack group for your
      home's devices to share their current status and talk to each other.
      </p>
      <p>
      There are two ways to integrate with HomeStream. The primary method is to subscribe to real-time events via MQTT.
      This will enable you to build the fastest apps with the least lines of code, and is how all of Hiome is built. However, sometimes a RESTful API 
      endpoint is preferable or necessary. We will mostly focus on MQTT below, but you
      can <a href="/api/docs">browse all the REST API endpoints here</a>. We will also be open-sourcing HomeStream SDK's
      in Python and JavaScript soon.
      </p>

      <a id="mqtt" /><h2>MQTT</h2>

      <p>
        <strong>TL;DR &rarr;</strong> Connect to <code>{window.location.host}:1883</code> and subscribe to <code>hs/1/com.hiome/+/+</code> to get started.
      </p>

      <p>
        <abbr title="Message Queuing Telemetry Transport">MQTT</abbr> is a lightweight pub-sub protocol for embedded IoT devices to communicate with each other. It's a widely adopted standard, meaning you can find client libraries for any language.
        At a high level, devices connect to a <em>broker</em>, which handles routing all messages, subscribe to <em>topics</em> to tell the broker which messages they're interested in, or publish their own messages to a topic.
        Hiome Core is the broker, so there's nothing to setup. You can just connect to <code>{window.location.host}</code> on port <code>1883</code> as long as you're on the same network.
      </p>

      <p>We'll use the excellent <a href="https://www.github.com/mqttjs/MQTT.js">mqtt.js library</a> for our examples, but the approach will be the same for any language.</p>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`// connect to Hiome Core
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://${window.location.host}:1883")`}
      </SyntaxHighlighter>

      <a id="mqtt-topics" /><h3>Topics</h3>

      <p>
        Topics in HomeStream contain 5 parts: <code><span style={{color: '#4990E2'}}>protocol</span>/<span style={{color: '#50E3C2'}}>version</span>/<span style={{color: '#D0011B'}}>namespace</span>/<span style={{color: '#F6A623'}}>object_id</span>/<span style={{color: '#417505'}}>attribute</span></code>
      </p>

      <p>
        The protocol is <code>hs</code>, and the current version is <code>1</code>. For Hiome devices, the namespace will always be <code>com.hiome</code>. You can either find a device's id via a GET request to <code>/api/1/rooms</code> or <code>/api/1/sensors</code>, or
        subscribe to <code>hs/1/com.hiome/+/occupancy</code> to dynamically discover all objects with the occupancy attribute.
        The attribute can be anything, but some common ones are <code>occupancy</code>, <code>door</code>, <code>name</code>, or <code>battery</code>. The easiest way to discover all available topics is to subscribe to <code>hs/1/com.hiome/#</code> and print each message's topic. We'll do this below.
      </p>

      <p>
        For example, <code><span style={{color: '#4990E2'}}>hs</span>/<span style={{color: '#50E3C2'}}>1</span>/<span style={{color: '#D0011B'}}>com.hiome</span>/<span style={{color: '#F6A623'}}>{room.id}</span>/<span style={{color: '#417505'}}>occupancy</span></code> will publish changes in occupancy count for {room.name}.
      </p>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`// subscribe to a topic
client.on("connect", function() {
  client.subscribe("hs/1/com.hiome/${room.id}/occupancy", {qos: 1})
})`}
      </SyntaxHighlighter>

      <a id="mqtt-payload" /><h3>Payload</h3>

      <p>
        Once subscribed, messages will have a payload, which is always a valid JSON
        object with at least 2 keys: <code>val</code> (the new value of the attribute) and <code>ts</code> (timestamp when the message was published
        in <b>milliseconds</b> since Unix epoch). A message may have other keys as well, but these are the only 2 required ones. A more detailed
        description of different event payloads can be found <a href="#events">below</a>.
      </p>

      <SyntaxHighlighter language="javascript" style={docco}>
      {`{"val": 2, "ts": ${new Date().getTime()}}`}
      </SyntaxHighlighter>

      <p>
        The one exception to this rule is if an object is deleted. In that case, its topics should be cleared, resulting in a single message
        with an empty payload to let existing subscribers know to forget that topic.
      </p>

      <p>Bringing it all together, here's a complete example:</p>

      <SyntaxHighlighter language="javascript" style={docco} showLineNumbers={true}>
        {`// connect to Hiome Core
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://${window.location.host}:1883")

// subscribe to a topic
client.on("connect", function() {
  client.subscribe("hs/1/+/+/+", {qos: 1})
})

// parse incoming messages
client.on("message", function(topic, msg, packet) {
  const [protocol, hs_version, namespace, object_id, attribute] = topic.split("/")
  if (msg.length === 0) {
    console.log(\`deleted $\{namespace}/$\{object_id}\`)
    return
  }

  const payload = JSON.parse(msg.toString())
  console.log("topic: " + topic)
  console.log(payload)
  console.log(\`$\{namespace}/$\{object_id} $\{attribute} is $\{payload.val}\`)

  // do something useful with payload
})`}
      </SyntaxHighlighter>

      <p>By the way, try opening your browser's dev console and walking through a door to see this code in action <span role="img" aria-label="wink">😉</span></p>

      <a id="mqtt-sub" /><h3>Subscribing</h3>

      <p>
        You must have a globally unique client ID when connecting to the MQTT broker. Your MQTT client library
        should handle this, but if you want Hiome Core to queue messages for you while your script is disconnected
        for whatever reason, then you'll need to specify your client ID and set the clean session flag to false
        when connecting so that Hiome Core knows to continue your previous session. That client ID must remain consistent
        in order to pick up your old session's queue of messages where it left off. We recommend using your MAC address as
        your client ID.
      </p>

      <p>
        The latest value is retained for stateful attributes (like occupancy or name), so whenever you subscribe, you will immediately get the
        latest value for those attributes.
      </p>

      <a id="mqtt-ledger" /><h4>Reading From HomeStream's Ledger</h4>

      <p>
        MQTT is great for getting notified when a new event occurs, but if you want to read older events from the log, you'll need to use the Events API.
        Simply issue a GET request to <code>/api/1/{'<mqtt topic>'}/{'<from timestamp>'}</code>.
        For example, try visiting <a href={`/api/1/hs/1/com.hiome/${room.id}/occupancy/${new Date().getTime() - 86400000}`}>http://{window.location.host}/api/1/hs/1/com.hiome/{room.id}/occupancy/{new Date().getTime() - 86400000}</a> for
        all occupancy changes in {room.name} in the last 24 hours. You can <a href="/api/docs/#api-Events-Index">read more about the endpoint here</a>.
      </p>

      <a id="mqtt-pub" /><h3>Publishing</h3>

      <p>
        As mentioned above, all messages are valid JSON objects that must include a <code>val</code> and <code>ts</code> key. <code>val</code> can
        be either a string, number, boolean, or null, representing the value of the attribute. <code>ts</code> is always the
        number of <b>milliseconds</b> since Unix epoch.
      </p>
      <p>
        If the event is stateful, meaning the value won't change until the next event, then the message should also have
        its <code>retain</code> flag set to true. This allows somebody who subscribes to your topic to read your current status
        immediately without waiting for the next update. However, if the event is ephemeral (like a notification), do not retain it.
      </p>

      <p>
        Currently, it is technically possible to publish as any device. However, you should only publish to your own namespace.
        In the future, we will enforce this restriction by performing a proof of ownership to publish to a namespace.
        For development purposes, you can safely use <code>local</code> as your namespace if you don't have a domain.
      </p>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`// write to a topic
const payload = {val: true, ts: new Date().getTime()}
client.publish(hs/1/local/test/connected, JSON.stringify(payload), {retain: true, qos: 1})`}
      </SyntaxHighlighter>

      <a id="mqtt-tmpl" /><h4>Templates</h4>
      <p>
        Hiome Core's <a href="/hs">dashboard</a> shows your HomeStream logs. Currently, those logs are limited to messages
        written by Hiome, but we plan to open the templating system so your other events can appear in the logs in a
        friendly format too. If you're interested in this feature, <a href="mailto:support@hiome.com">let us know</a> for early access!
        You can also visit <a href="/hs?debug=true">http://{window.location.host}/hs?debug=true</a> to view the logs in debug mode, which
        will show all raw JSON payloads.
      </p>

      <a id="mqtt-context" /><h4>Context</h4>
      <p>
        Events can include a <code>context_topic</code> and <code>context_ts</code>. These are used to associate an event with another,
        so that we can trace <em>why</em> something happened. For example, when an entry occurs, the corresponding occupancy change event will include
        the entry's topic and timestamp as its context. If you publish something in response to an event, you should include the original event's
        topic and timestamp as the context.
      </p>

      <a id="mqtt-dm" /><h4>Direct Message</h4>

      <p>You should never overwrite another object's attribute values, since they are in a different namespace
      (and they deserve their autonomy too). In fact, you should normally just publish your own status and let other
      devices subscribe and react to them on their own. However, sometimes it is necessary to directly message another device.
      </p>

      <p>In this case, you can address messages to another device with the topic
      format <code>hs/1/${'{your_namespace}'}/${'{your_object_id}'}/to/${'{target_namespace}'}/${'{target_object}'}/${'{target_attribute}'}</code>
      </p>

      <p>For example, to increment the occupancy in {room.name}, you could
      write <code>{'{"val": '+(room.occupancy_count+1)+', "ts": ' + new Date().getTime() + '}'}</code> to <code>hs/1/local/test/to/com.hiome/{room.id}/occupancy</code>
      </p>

      <p>Since direct messages are not stateful, they should never be retained.</p>

      <a id="events" /><h2>Hiome Events</h2>

      <p>Here's a more in-depth description of the various events published by Hiome. It is not exhaustive, but should cover all topics that you'll use.
      To discover additional topics, you can use the debugger below or subscribe to <code>hs/1/com.hiome/#</code>.
      </p>

      <p>
        In most of these events, you will notice a <code>tmpl</code> key. This is used by HomeStream's templating system, and we will
        document that later. For now, you can safely ignore
        it. <code>val</code>, <code>ts</code>, <code>context_topic</code>, and <code>context_ts</code> are discussed above.
      </p>

      <a id="events-occupancy" /><h3>hs/1/com.hiome/+/occupancy</h3>

      <p>Counting occupancy is Hiome's raison d'être, so let's start with that one. This topic gets a new message whenever a room's occupancy changes.</p>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "ts": 1592410395540,
  "val": 1,
  "was_val": 2,
  "door_id": "5",
  "other_room_id": "1578349369",
  "context_topic": "hs/1/com.hiome/5/entry",
  "context_ts": 1592410395526,
  "tmpl": "exit"
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - the new occupancy count for this room</li>
        <li><code>was_val</code> - the previous occupancy count before this change</li>
        <li><code>door_id</code> - the door that the person walked through to cause this change</li>
        <li><code>other_room_id</code> - the adjoining room that the person went into or came from</li>
        <li><code>was_occupied_duration</code> - if the room just became empty, this will be the number of seconds the room was occupied</li>
        <li><code>was_empty_duration</code> - if the room just became occupied, this will be the number of seconds the room was empty</li>
      </ul>

      <p>
      As you can see, these additional keys are optional and will only be included if relevant. For example, if the occupancy is changing
      due to a manual correction, there is no associated door_id or other_room_id to include.
      </p>

      <Collapsible title="See available occupancy topics">{renderFilteredEvents(topics, "occupancy")}</Collapsible>

      <a id="events-entry" /><h3>hs/1/com.hiome/+/entry</h3>

      <p>This will publish whenever an entry or exit is detected by a Hiome Door sensor.</p>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "ts": 1592435250375,
  "val": 2,
  "entered": "1578357316",
  "exited": "1578357350",
  "is_valid": false,
  "confidence": 0.11743657755670567,
  "tmpl": "entry_exit",
  ...
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - the direction of entry, relative to the sensor, either 1 or 2</li>
        <li><code>entered</code> - the room id that the person entered</li>
        <li><code>exited</code> - the room id that the person exited</li>
        <li><code>is_valid</code> - whether or not Hiome considers this event real</li>
        <li><code>confidence</code> - Hiome's confidence in this event's validity</li>
      </ul>

      <p>
        You'll notice several additional keys included with entry events. These are raw metadata from the sensor about the entry, and are used to
        calculate the final confidence score. However, unless you are working on sensor firmware changes, they are meaningless and can be ignored.
      </p>

      <a id="events-door" /><h3>hs/1/com.hiome/+/door</h3>

      <p>This will publish whenever a door opens or closes.</p>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "val": "open",
  "was_val": "ajar",
  "ts": 1592436289908
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - the current state of the door, either "open", "ajar", or "closed"</li>
        <li><code>was_val</code> - the previous state of the door</li>
      </ul>

      <p>
        <code>ajar</code> means the door is almost closed, but not completely. Usually it's a sign that you forgot to close the door. Doors will
        usually transition from "closed" &rarr; "ajar" &rarr; "open" and then back when closing, but may skip being "ajar" if moving very quickly.
      </p>

      <Collapsible title="See available door topics">{renderFilteredEvents(topics, "door")}</Collapsible>

      <a id="events-battery" /><h3>hs/1/com.hiome/+/battery</h3>

      <p>This will publish whenever Hiome PowerPack's battery level changes.</p>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "val": 372,
  "was_val": 380,
  "label": "normal",
  "ts": 1592436289909
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - the current voltage of the battery, multiplied by 100. 0 means no battery detected.</li>
        <li><code>was_val</code> - the previous voltage of the battery</li>
        <li><code>label</code> - the battery level as a string, either "full", "high", "normal", "low", "critical", or "none"</li>
      </ul>

      <p>
        Measuring battery percentage is rather difficult. Hiome PowerPack's voltage ranges between 3.3v and 4.2v with a nominal voltage of 3.7v.
        That means when fully charged, the voltage will be around 4.2v, but it will quickly decay to 3.7v, where it will spend most of its life.
        Near the end of its capacity, it will once again quickly decay until it falls below 3.3v and cannot power the sensor anymore.
        In addition, the voltage measurements themselves may swing between readings. Combining these facts, we do not recommend trying
        to estimate a percentage from this data. Instead, you should just rely on the label, which gives a general estimate of battery life.
      </p>

      <p>
        When Hiome PowerPack is connected to Hiome Door, Hiome Door will report the battery level. When you connect Hiome PowerPack to a wall
        outlet to recharge it, it will report its battery level directly using its own device id. This enables you to know when
        it's done charging. To find the correct device id, you can use <code>/api/1/sensors</code> to list all devices and look for the ones
        with <code>"type": "battery"</code>.
      </p>

      <Collapsible title="See available battery topics">{renderFilteredEvents(topics, "battery")}</Collapsible>

      <a id="events-name" /><h3>hs/1/com.hiome/+/name</h3>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "val": "Living Room",
  "ts": 1592436289909
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - the name of the object</li>
      </ul>

      <Collapsible title="See available name topics">{renderFilteredEvents(topics, "name")}</Collapsible>

      <a id="events-version" /><h3>hs/1/com.hiome/+/version</h3>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "val": "V20.6.16",
  "was_val": "V20.6.15",
  "ts": 1592436289909
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - the current firmware version of the object</li>
        <li><code>was_val</code> - the previous firmware version of the object</li>
      </ul>

      <Collapsible title="See available version topics">{renderFilteredEvents(topics, "version")}</Collapsible>

      <a id="events-connected" /><h3>hs/1/com.hiome/+/connected</h3>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "val": true,
  "ts": 1592436289909
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - whether the device is online or not</li>
      </ul>

      <Collapsible title="See available connected topics">{renderFilteredEvents(topics, "connected")}</Collapsible>

      <a id="events-updating" /><h3>hs/1/com.hiome/updater/updating</h3>

      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "val": true,
  "ts": 1592436289909
}`}
      </SyntaxHighlighter>

      <ul>
        <li><code>val</code> - whether Hiome Core is updating itself or devices right now</li>
      </ul>

      <a id="events-sun" /><h3>hs/1/com.hiome/sun/position</h3>
      <p>
        Get notified when the sun rises and sets. This is based on your IP address's geolcation, so it is not super accurate but should be roughly correct.
      </p>
      <SyntaxHighlighter language="javascript" style={docco}>
        {`{
  "val": "sunrise",
  "ts": 1592388904000,
  "occurred_at": 1592388904000,
  "tmpl": "sunrise"
}`}
      </SyntaxHighlighter>

      <p>
        <code>occurred_at</code> is the time the sun position changed, while <code>ts</code> is the time the event was published.
        These will usually be very similar, but it's possible for them to drift, such as if Hiome Core was turned on in the middle of the day.
      </p>

      <a id="timer" /><h2>Timer</h2>

      <p>
        Hiome includes a timer service that you can use to trigger an event after a certain amount of time. To use it, simply send a direct message to the timer
        service: <code>hs/1/${'{your_namespace}'}/${'{your_object_id}'}/to/com.hiome/timer/${'{timer_name}'}</code> where <code>timer_name</code> is an
        arbitrary name for your timer.
      </p>
      <p>
        The payload must include a <code>unit</code> key with a value of
        either <code>['seconds', 'minutes', 'hours', 'days']</code>. <code>val</code> should be the number of that time unit to wait.
        For example, <code>{'{"val": 4, "unit": "hours", "ts": ' + new Date().getTime() + '}'}</code> will start a 4 hour timer.
      </p>
      <p>
        Once the requested time expires, the timer service will write back to you and the attribute will be your timer name + <code>'_expired'</code>. For
        example, <code>hs/1/local/test/to/com.hiome/timer/device_seen</code> will eventually trigger <code>hs/1/com.hiome/timer/to/local/test/device_seen_expired</code>.
        If you make multiple requests from the same object for the same timer name, the timer will reset each time, such that you will only receive an expired
        event when the last timer request runs out. To cancel an existing timer, simply send a request with <code>val</code> set to <code>null</code> in the payload.
      </p>

      <p>
        Note that the timer service is best effort. Do not use it for mission critical scenarios, as any active timers will be forgotten during a reboot
        or software update.
      </p>

      <a id="version" /><h2>Version</h2>

      <p>
        Hiome Core is in beta and this API is subject to change. Additionally, this documentation is a work in progress. Please email any questions to <a href="mailto:support@hiome.com">support@hiome.com</a> and we'll
        be happy to help!
      </p>

      <a id="debugging" /><h2>Debugging</h2>

      <p>
        Here's a live preview of the last {ev.length} events seen by Hiome Core. You can also
        append <code>?debug=true</code> to the URL of any <a href="/hs?debug=true">log view in the dashboard</a> to see raw JSON payloads.
      </p>

      { renderEvents(ev) }
      </Content>
    </AntLayout>
  </Layout>
}

export default DocsPage

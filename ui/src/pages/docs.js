import React from 'react'

import LayoutPage from '../components/LayoutPage'
import SEO from '../components/seo'

const DocsPage = () => (
  <LayoutPage>
    <SEO title="Documentation" />
    <div>
      <h1>Hiome API Documentation</h1>

      <p>
        Hiome Core manages all of your Hiome Door sensors and counts occupancy for every room. All of this data stays
        locally within your home and can be accessed while you are on your local network.
      </p>

      <h2>API</h2>

      <p>
        You can get a list of all rooms configured in your home by doing a HTTP GET request
        to <a href="http://hiome.local/api/1/rooms">http://hiome.local/api/1/rooms</a>. This returns a JSON response
        that looks like
      </p>

      <code><pre>
      {'[{"id":"1554713930","name":"Bedroom","occupancy_count":0},{"id":"1554713914","name":"Living Room","occupancy_count":2}, ...]'}
      </pre></code>

      <h2>MQTT</h2>

      <p>
        You can also get notified whenever the occupancy count changes in a room by connecting to Hiome Core's
        MQTT broker at <code>mqtt://hiome.local:1883</code>
      </p>

      <p>
        Once connected, you can subscribe to <code>hiome/1/sensor/#</code> to get notifications for all sensors
        configured with Hiome. Each room will publish to a topic like <code>hiome/1/sensor/room_id:occupancy</code>
        with a payload like
      </p>

      <code><pre>
      {'{"meta": {"source": "gateway", "type": "occupancy", "room": "1554713914", "name": "Living Room Occupancy"}, "ts": 1555619832.71695, "val": 2}'}
      </pre></code>

      <p>
        The latest value is retained for each sensor topic, so whenever you subscribe, you will immediately get the
        latest occupancy count for each room.
      </p>

      <p>Here's an example using the <a href="https://www.github.com/mqttjs/MQTT.js">mqtt.js library</a>:</p>

      <pre><code>
      {'const mqtt = require("mqtt")\n'}
      {'const client = mqtt.connect("mqtt://hiome.local:1883")\n'}
      {'const rooms = {}\n\n'}

      {'client.on("connect", function() {\n'}
      {'  client.subscribe("hiome/1/sensor/#", {qos: 1})\n'}
      {'})\n\n'}

      {'client.on("message", function(topic, msg, packet) {\n'}
      {'  const message = JSON.parse(msg)\n'}
      {'  if (message["meta"]["type"] === "occupancy") {\n'}
      {'    rooms[message["meta"]["room"]] = message["val"]\n'}
      {'    console.log(message["meta"]["name"] + " is now " + message["val"])\n'}
      {'  }\n'}
      {'})\n'}
      </code></pre>

      <h3>Subscribing</h3>

      <p>
        You must have a globally unique client ID when connecting to the MQTT broker. Your MQTT client library
        should handle this, but if you want Hiome Core to queue messages for you while your script is disconnected
        for whatever reason, then you'll need to specify your client ID and set the clean session flag to false
        when connecting so that Hiome Core knows to continue your previous session. That client ID must remain consistent
        in order to pick up your old session's queue of messages where it left off. I recommend using your MAC address as
        your client ID.
      </p>

      <h3>Publishing</h3>

      <p>
        If you are making your own sensors and decide to publish events through Hiome Core, you'll need to make sure
        your sensor has a globally unique ID. I recommend using a prefix like "mydevice:1" to guarantee you
        don't conflict with another sensor.
      </p>

      <h2>Versioning</h2>

      <p>
        Of course, Hiome Core is in beta and this documentation is subject to change. This page will always reflect your
        Hiome Core's API.
      </p>
    </div>
  </LayoutPage>
)

export default DocsPage

import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/Layout'

const ChangelogPage = () => (
  <Layout title="What's New">
    <h2 className="changelog-date">&#9733; June 2020</h2>
    <p>Hiome has a major update!</p>
    <ul>
      <li><span role="img" aria-label="design">🎨</span> Redesigned dashboard</li>
      <li><span role="img" aria-label="book">📖</span> More detailed logs of what's happening in your home</li>
      <li><span role="img" aria-label="fire">🔥</span> Even faster responsiveness</li>
      <li><span role="img" aria-label="cancel">❌</span> Undo false entries to revert them</li>
      <li><span role="img" aria-label="brain">🧠</span> New AI for error correction</li>
    </ul>

    <p>
      You can now <Link to="/door">train Hiome</Link> on which entries to count.
      Previously, Hiome relied on predefined thresholds to decide whether an event was valid or not, and the sensitivity slider could just adjust that slightly.
      We have migrated to letting each sensor learn what a valid event looks like, specific to that door. This should provide a nice boost to accuracy!
    </p>

    <p><strong>Breaking Changes</strong></p>
    <ul>
      <li>MQTT topics have changed. Please consult the new <Link to="/docs">API docs</Link> to update your custom scripts</li>
      <li>IFTTT event names have slightly changed. Please see <Link to="/settings/integrations/ifttt">IFTTT integration</Link></li>
    </ul>
  </Layout>
)

export default ChangelogPage

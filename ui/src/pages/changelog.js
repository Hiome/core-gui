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
      <li><span role="img" aria-label="coder">👩‍💻</span> Improved <Link to="/docs">API docs</Link></li>
      <li><span role="img" aria-label="cancel">❌</span> Undo entries to revert them</li>
      <li><span role="img" aria-label="brain">🧠</span> Improved error correction with AI that learns what's valid and what's noise in <em>your</em> home</li>
    </ul>

    <p>
      That last point is actually the most exciting. You can now <Link to="/door">train Hiome</Link> on which events to consider valid in order to improve accuracy.
      Previously, Hiome relied on predefined thresholds to decide which events were valid or not, and the sensitivity slider could just adjust that slightly.
      We have migrated to letting each sensor learn what a valid event looks like, specific to that door. This should provide a nice boost to accuracy!
    </p>
  </Layout>
)

export default ChangelogPage

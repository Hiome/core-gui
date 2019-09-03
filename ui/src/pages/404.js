import React from 'react'
import { Link } from 'gatsby'

import LayoutPage from '../components/LayoutPage'
import SEO from '../components/seo'

import startled from '../images/startled.svg'

const NotFoundPage = () => (
  <LayoutPage>
    <SEO title="Not Found" />
    <object data={startled} type="image/svg+xml" style={{
      display: `block`,
      margin: `10px auto`,
      width: `90%`,
      maxWidth: `372px`,
      height: `275px`,
      top: 0,
    }}>
      Startled
    </object>
    <h1 style={{margin: `5%`}}>Well, this is awkward.</h1>
    <p style={{textAlign: `center`, lineHeight: `1.8em`}}>
      We can't find the page you're looking for.<br/>
      <Link to="/">Go to your dashboard</Link> or <Link to="mailto:support@hiome.com?subject=Something%20broke" title="Let us know what you were looking for">let us know what happened</Link>.</p>
  </LayoutPage>
)

export default NotFoundPage

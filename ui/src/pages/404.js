import React from 'react'
import { navigate } from 'gatsby'
import { Button } from 'antd'

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
      We can't find the page you're looking for.</p>
      <div className="ant-result-extra">
        <Button onClick={() => window.dispatchEvent(new Event("helpMe"))}>Contact Support</Button>
        <Button onClick={() => navigate('/')} type="primary">Go to Dashboard</Button>
      </div>
  </LayoutPage>
)

export default NotFoundPage

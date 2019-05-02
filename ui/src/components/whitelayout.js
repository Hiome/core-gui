/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const WhiteLayout = ({ children }) => (
  <>
    <Header />
    <div
      style={{
        margin: `0 auto 50px auto`,
        maxWidth: 960,
        padding: `1.45rem`,
        backgroundColor: `#fff`,
        color: `#000008`,
        boxShadow: `0 0 10px rgba(0, 0, 0, 0.2)`,
      }}
    >
      <main>{children}</main>
    </div>
  </>
)

WhiteLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default WhiteLayout

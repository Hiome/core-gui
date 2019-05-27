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

const Layout = ({ children, goBack }) => (
  <>
    <Header goBack={goBack} />
    <div
      style={{
        margin: `0 auto`,
        padding: `0px 0px 1.45rem`,
      }}
    >
      <main>{children}</main>
    </div>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  goBack: PropTypes.bool,
}

Layout.defaultProps = {
  goBack: false
}

export default Layout

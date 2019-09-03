import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const Layout = ({ children, goBack }) => (
  <>
    <Header goBack={goBack} />
    <main>{children}</main>
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

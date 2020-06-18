import React from "react"
import PropTypes from "prop-types"

import SEO from './seo'
import Header from "./header"
import "./layout.css"

const Layout = ({ children, title }) => (
  <>
    <SEO title={title} />
    <Header title={title} />
    <main>
      {children}
      <footer>Powered by Hiome.</footer>
    </main>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

export default Layout

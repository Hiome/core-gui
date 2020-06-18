import React from "react"
import PropTypes from "prop-types"

import SEO from './seo'
import Header from "./header"
import "./layout.css"

const Layout = ({ children, title, menuOptions, menuCallback }) => (
  <>
    <SEO title={title} />
    <Header title={title} menuOptions={menuOptions} menuCallback={menuCallback} />
    <main>
      {children}
      <footer>Powered by Hiome.</footer>
    </main>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  menuOptions: PropTypes.arrayOf(PropTypes.node),
  menuCallback: PropTypes.func
}

Layout.defaultProps = {
  menuOptions: [],
  menuCallback: undefined
}

export default Layout

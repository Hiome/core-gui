import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const Layout = ({ children, goBack, menuOptions, menuCallback }) => (
  <>
    <Header goBack={goBack} menuOptions={menuOptions} menuCallback={menuCallback} />
    <main>{children}</main>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  goBack: PropTypes.bool,
  menuOptions: PropTypes.arrayOf(PropTypes.node),
  menuCallback: PropTypes.func
}

Layout.defaultProps = {
  goBack: false,
  menuOptions: [],
  menuCallback: undefined
}

export default Layout

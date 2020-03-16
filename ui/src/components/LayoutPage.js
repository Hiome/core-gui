import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const LayoutPage = ({ children, headline, goBack, menuOptions, menuCallback }) => (
  <div id="wrapper">
    <Header goBack={goBack} menuOptions={menuOptions} menuCallback={menuCallback} />
    {headline}
    <main className="page">
      {children}
      <footer>&copy; Hiome Inc {new Date().getFullYear()}</footer>
    </main>
  </div>
)

LayoutPage.propTypes = {
  children: PropTypes.node.isRequired,
  headline: PropTypes.node,
  goBack: PropTypes.bool,
  menuOptions: PropTypes.arrayOf(PropTypes.node),
  menuCallback: PropTypes.func
}

LayoutPage.defaultProps = {
  goBack: false,
  headline: null,
  menuOptions: [],
  menuCallback: undefined
}

export default LayoutPage

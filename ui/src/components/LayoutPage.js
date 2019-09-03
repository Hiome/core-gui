import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const LayoutPage = ({ children, headline, goBack }) => (
  <div id="wrapper">
    <Header goBack={goBack} />
    {headline}
    <main className="page">
      {children}
      <footer>&copy; Hiome Inc 2019</footer>
    </main>
    <div style={{
      position: `fixed`,
      bottom: `25px`,
      zIndex: `-10`,
      fontSize: `20px`,
      textAlign: `center`,
      width: `100%`
    }}>
      <span role="img" aria-hidden>👋</span>
    </div>
  </div>
)

LayoutPage.propTypes = {
  children: PropTypes.node.isRequired,
  headline: PropTypes.node,
  goBack: PropTypes.bool,
}

LayoutPage.defaultProps = {
  goBack: false,
  headline: null
}

export default LayoutPage

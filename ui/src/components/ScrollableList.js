import { Component } from "react"
import PropTypes from "prop-types"

class ScrollableList extends Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return document.documentElement.scrollHeight - document.documentElement.scrollTop
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (document.documentElement.scrollTop > 0) document.documentElement.scrollTop = document.documentElement.scrollHeight - snapshot
  }

  render() {
    return this.props.items.map(i => this.props.renderItem(i))
  }
}

ScrollableList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
}

export default ScrollableList

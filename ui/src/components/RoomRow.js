import { Link } from "gatsby"
import { Button, Modal, Icon, InputNumber, message } from "antd"
import React, { useState } from "react"
import PropTypes from "prop-types"

import HomeStream from './homestream'

const resetCount = (v, id, name, count) => {
  v = parseInt(v)
  if (!isNaN(v) && v !== count && v >= 0) {
    HomeStream.write(`com.hiome/gui/to/com.hiome/${id}/occupancy`, v)
    message.success(`Updated ${name}'s occupancy to ${v}`)
  }
}

const RoomRow = ({ id, occupancy_count, name }) => {
  const [visible, setVisible] = useState(false)

  return (<>
    <Link to={`/hs/1/com.hiome/${id}/~~`}
      className={`room ${occupancy_count > 0 ? 'active' : ''}`}
      title={name}
    >
      <Button icon="ellipsis" shape="circle" ghost
        onClick={e => {e.preventDefault();setVisible(true);return false}}
        style={{marginRight: '10px', verticalAlign: 'middle', color: occupancy_count > 0 ? '#000' : '#a0a0a0'}}
      />
      { occupancy_count } { name }
    </Link>
    <Modal
      title={name}
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      okText="Done"
      cancelButtonProps={{style:{display: 'none'}}}
    >
      <p>You can change {name}'s occupancy count, but in order to help me learn, please <Link to="/door">tell me which entry I got wrong</Link>!</p>
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <InputNumber
          min={0}
          max={99}
          autoFocus
          value={occupancy_count}
          onChange={v => resetCount(v, id, name, occupancy_count)}
          size="large"
          type="number"
        />
      </div>
      <p><Link to="/door"><Icon type="like" /> Calibrate Hiome</Link></p>
      <p><Link to={`/hs/1/com.hiome/${id}/~~`}><Icon type="history" /> {name} Logs</Link></p>
      <p><Link to={`/settings/room?id=${id}`}><Icon type="setting" /> {name} Settings</Link></p>
    </Modal>
  </>)
}

RoomRow.propTypes = {
  id: PropTypes.string.isRequired,
  occupancy_count: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
}

export default RoomRow

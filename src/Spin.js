import React from 'react'
import { Spin as SpinAntd , Icon } from 'antd'

const Spin = () => <SpinAntd indicator={<Icon type="loading" style={{ fontSize: 16 }} spin />} />

export default Spin
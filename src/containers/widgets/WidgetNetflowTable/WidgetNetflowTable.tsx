import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'
import { Col } from 'antd'
import NetflowTableContainer from '@containers/netflow/NetflowTableContainer/NetflowTableContainer'

interface IWidgetNetflowTable {
}

const WidgetNetflowTable: FC<TWidgetSettings<IWidgetNetflowTable>> = (props) => {
    const { settings } = props
    const { widget } = settings

    return (
        <Col span={24}>
            <NetflowTableContainer />
        </Col>
    )
}

export default WidgetNetflowTable
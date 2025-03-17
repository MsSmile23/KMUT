import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'
import { DiscoveryTableContainer } from '@containers/discovery'
import { Col } from 'antd'

interface WidgetDiscoveryTableProps {
    hiddenStereoType?: string
    widgetId?: string
}
const WidgetDiscoveryTable: FC<TWidgetSettings<WidgetDiscoveryTableProps>> = (props) => {
    const { settings } = props
    const { widget } = settings
    
    return (
        <div style={{ width: '100%', overflow: 'auto' }}>
            <DiscoveryTableContainer widgetId={widget?.widgetId} hiddenStereotype={widget?.hiddenStereoType} />
        </div>
    )
}

export default  WidgetDiscoveryTable
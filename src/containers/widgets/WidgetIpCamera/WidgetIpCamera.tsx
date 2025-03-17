import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'
import Player from '@shared/ui/player/Player'

interface WidgetIpCameraProps {
    url: string
}
const WidgetIpCamera: FC<TWidgetSettings<WidgetIpCameraProps>> = (props) => {
    const { settings } = props
    const { widget } = settings

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Player url={widget?.url} />
        </div>
    )
}

export default WidgetIpCamera
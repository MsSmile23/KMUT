import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { BaseButton } from '@shared/ui/buttons'
import { getURL } from '@shared/utils/nav'
import { Button } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { TWidgetSettings } from '../widget-types'



export interface IWidgetMiniHeader {
    back: boolean,
    home: boolean
}
const WidgetMiniHeader: FC<TWidgetSettings<IWidgetMiniHeader>> = (props) => {
    const { settings } = props
    const { widget } = settings
    const { back = true, home = true } = widget
    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1)
    }

    const goHome = () => {
        navigate(getURL('/', 'showcase'))
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {back && <BaseButton shape="circle" icon={<ArrowLeftOutlined />} onClick={goBack} /> }
            {home && <BaseButton shape="circle" icon={<HomeOutlined />} onClick={goHome} />}
        </div>
    )
}

export default WidgetMiniHeader
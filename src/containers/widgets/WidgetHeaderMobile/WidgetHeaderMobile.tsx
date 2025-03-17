import HeaderMobile, { IHeaderMobile } from '@shared/ui/HeaderMobile/HeaderMobile'
import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'

const WidgetHeaderMobile: FC<TWidgetSettings<IHeaderMobile>> = (props) => {
    const { settings } = props
    const { widget, vtemplate } = settings

    return (
        <HeaderMobile {...widget} id={vtemplate.objectId} />
    )
}

export default WidgetHeaderMobile
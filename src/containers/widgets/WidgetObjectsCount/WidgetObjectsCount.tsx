import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'
import ObjectCountContainer from '@containers/objects/ObjectCountContainer/ObjectCountContainer'
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'

interface WidgetObjectsCountProps {
    title?: string
    icon?: IECIconView['icon']
    textSize?: string
    indent?: string
    color?: string
    filterMnemo: 'class_id'
    filterValue: number[]
}

const WidgetObjectsCount: FC<TWidgetSettings<WidgetObjectsCountProps>> = (props) => {
    const { settings } = props
    const { widget } = settings

    return (
        <ObjectCountContainer
            title={widget?.title}
            icon={widget?.icon}
            textSize={widget?.textSize}
            indent={widget?.indent}
            color={widget?.color}
            filters={{ mnemo: widget?.filterMnemo, value: widget?.filterValue }}
        />
    )
}

export default WidgetObjectsCount
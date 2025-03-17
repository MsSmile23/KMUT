import { ObjectStateHistory } from '@entities/states/ObjectStateHistory/ObjectStateHistory'
import { IObject } from '@shared/types/objects'
import { FC } from 'react'

interface WidgetStateHistoryProps {
    settings: {
        widget: {
            object: IObject
        },
        view: any
    }
}

const WidgetStateHistory: FC<WidgetStateHistoryProps> = (props) => {
    
    const { settings } = props
    const { widget } = settings

    return (
        <ObjectStateHistory settings={{ entityId: widget?.object?.id || undefined, targetEntity: 'object' }} />
    )
}

export default WidgetStateHistory
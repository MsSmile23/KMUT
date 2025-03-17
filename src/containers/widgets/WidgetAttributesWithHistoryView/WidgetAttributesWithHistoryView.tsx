import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { FC } from 'react'

interface WidgetAttributesWithHistoryViewProps {
    settingsWidget: {
        widget: {
            object: any
        },
        view: any
    }
}

const WidgetAttributesWithHistoryView: FC<WidgetAttributesWithHistoryViewProps> = (props) => {

    const { settingsWidget } = props
    const { widget } = settingsWidget

    return (
        <ObjectOAttrsWithHistory object={widget?.object} />
    )
}

export default WidgetAttributesWithHistoryView
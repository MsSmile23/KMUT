import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import ObjectAttributesAndChildStates, { IObjectAttributesAndChildStates } from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import { IObject } from '@shared/types/objects'
import { FC } from 'react'

interface WidgetObjectAttributesAndChildStatesProps {
    settings: {
        widget: {
            object: IObject
        },
        view: any
    }
}

const WidgetObjectAttributesAndChildStates: FC<WidgetObjectAttributesAndChildStatesProps> = (props) => {

    const { settings } = props
    const { widget } = settings
    
    const objectAttributesAndChildStatesProps = {
        objectAttributesWidgetProps: {
            oaAtrrWidgetProps: {
                attributesIds: forumThemeConfig.build.deviceStatuses.attributes.attributeIds
            }
        },
        objectStatusLabelsProps: {
            statusLabelsProps: {
                classes_id: forumThemeConfig.build.deviceStatuses.stateLabels.classes_id
            }
        },
        statusChartProps: {
            title: 'Состояние оборудования',
            chartProps: forumThemeConfig.build.deviceStatuses.chart
        }
    } as IObjectAttributesAndChildStates['sections']

    
    return (
        <ObjectAttributesAndChildStates
            object={widget?.object || undefined} //Внимание нужна прокидка объекта
            sections={objectAttributesAndChildStatesProps}
        />
    )
}

export default WidgetObjectAttributesAndChildStates
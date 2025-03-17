import { FC, useMemo } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { CenterAnalysisMetrics } from './CenterAnalysisMetrics'
import { IWidgetCenterAnalysisMetricsFormProps } from './WidgetCenterAnalysisMetricsForm'

const WidgetCenterAnalysisMetrics: FC<TWidgetFormSettings<
    IWidgetCenterAnalysisMetricsFormProps
>> = (props) => {
    const { settings } = props
    const { widget, vtemplate, baseSettings } = settings
    const widgetHeight = useMemo(() => widget.height, [widget.height])

    return (
        <div
            style={{
                width: '100%',
                height: widgetHeight
                    ? `calc(${widgetHeight}px - 0px)` 
                    : '100%', 

            }}
            className="widget-container"
        >
            <CenterAnalysisMetrics 
                vtemplateSettings={{
                    classIds: baseSettings?.classes, // исправить!
                    objectId: vtemplate?.objectId,
                    vtemplateId: baseSettings?.vtemplateId
                }}
                classSettings={widget}
                camVisualSettings={widget?.visual}
            />
        </div>
    )
}

export default WidgetCenterAnalysisMetrics
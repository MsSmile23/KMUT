import { CenterAnalysisMetrics } from '@containers/widgets/WidgetCenterAnalysisMetrics/CenterAnalysisMetrics'
import { FC } from 'react'

export const DemoCenterAnalysisMetrics: FC = () => {
    return (
        <div
            style={{
                // position: 'fixed',
                width: '100%',
                height: '1000px',
                overflow: 'hidden auto',
            }}
        >
            <CenterAnalysisMetrics 
                vtemplateSettings={{
                    classIds: undefined,
                    objectId: 10001,
                    vtemplateId: 1
                }}
                classSettings={{
                    linkedClasses: [{
                        linking: [],
                        target: []
                    }],
                    rootClasses: [ ],
                    rootObjects: [ ]
                }}
            />
        </div>
    )
}
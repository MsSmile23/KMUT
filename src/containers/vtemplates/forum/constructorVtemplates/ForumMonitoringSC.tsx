import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import ObjectAttributesAndChildStates, { IObjectAttributesAndChildStates } from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'

import { FC } from 'react'
import { useGetObjects } from '@shared/hooks/useGetObjects'

const ForumMonitoringSC: FC = () => {
    const objects = useGetObjects()

    const chartProps = { ...forumThemeConfig.main.statuses.chart }

    chartProps.height = 330
    chartProps.legendSettings.chartRatio = 0.25
    chartProps.legendSettings.legendRatio = 0.55
    chartProps.legendSettings.chart.height = 230

    const mainSections = {
        objectStatusLabelsProps: {
            statusLabelsProps: {
                classes_id: forumThemeConfig.classesGroups.favourMain
            }
        },
        statusChartProps: {
            chartProps: { ...chartProps }
        }
    } as IObjectAttributesAndChildStates['sections']
    const inRowWidth = 'calc((100% - 4 * 16px)/ 3)'
    const fiveInRowWidth = 'calc((100% - 4 * 16px)/ 5)'
    
    return (
        <div
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                rowGap: 16,
                width: '100%', 
                justifyContent: 'center', 
                alignItems: 'center', height: '100%' }}
        >
            <div
                style={{
                    display: 'flex', 
                    flexDirection: 'row',
                    columnGap: 16,
                    width: '100%', 
                    justifyContent: 'center' }}
            >
                <WrapperWidget
                    height={chartProps.height - 60}
                    style={{ 
                        overflow: 'hidden', 
                        width: inRowWidth,
                        marginBottom: 0 
                    }}
                >
                    <ObjectAttributesAndChildStates
                        maxWidth={false}
                        labelsContainerHeight={264}
                        labelsCount={6}
                        object={objects.find(obj =>  obj.class_id ==  forumThemeConfig.forumClass )}
                        sections={mainSections}
                        mainObject
                        titleStyle={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: 30,
                            fontSize: '14px !important'
                        }}
                    />

                </WrapperWidget>
            </div>
        </div>)
}

export default ForumMonitoringSC
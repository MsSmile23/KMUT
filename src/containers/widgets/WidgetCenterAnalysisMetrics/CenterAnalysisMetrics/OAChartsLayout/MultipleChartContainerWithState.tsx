/* eslint-disable max-len */
import { FC, useMemo } from 'react'
import MultipleChartContainer from '@entities/attributes/MultipleChartContainer/MultipleChartContainer'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import ObjectAttributeHistoryWrapper from '@entities/objects/ObjectAttributeHistoryWrapper/ObjectAttributeHistoryWrapper'
import { MLErrorBoundary } from '@shared/ui/MLErrorBoundary'
// import { buttonsData } from '@entities/objects/ObjectAttributeHistoryWrapper/data'
// import { exportData } from '@containers/objects/AttributeHistoryChartContainer/utils'
import { IObjectOAttrsWithHistoryProps } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { IObjWithOAIdsArray } from '../cam.types'
import { IWidgetCenterAnalysisMetricsFormProps } from '../../WidgetCenterAnalysisMetricsForm'
import { getPriorityState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { OpUnitType } from 'dayjs'

export interface IMultipleChartContainerWithStateProps {
    autoUpdate?: IObjectOAttrsWithHistoryProps['autoUpdate']
    oaIds: IObjWithOAIdsArray[]
    classSettings: IWidgetCenterAnalysisMetricsFormProps
    gridCount: number
    chartWidth: string
    commonSettings?: {
        limit?: number
        dateInterval?: [string, string]
        defaultPeriod?: OpUnitType | string
    }
    background?: string
    color?: string
}
export const MultipleChartContainerWithState: FC<IMultipleChartContainerWithStateProps> = ({
    // autoUpdate = {
    //     enabled: true,
    //     time: 600_000
    // },
    oaIds,
    classSettings,
    gridCount,
    chartWidth,
    commonSettings,
    background,
    color
}) => {
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    // const [isAutoUpdate, setIsAutoUpdate] = useState(autoUpdate.enabled)
    // const [openModalChart, setOpenModalChart] = useState(false)
    // const [openModalInfo, setOpenModalInfo] = useState(false)
    // const toggleModalChartIsVisible = () => {
    //     if (openModalChart && !isAutoUpdate) {
    //         setIsAutoUpdate(true)
    //     }
    //     setOpenModalChart(!openModalChart)
    // }
    // const toggleModalInfoIsVisible = () => {
    //     setOpenModalInfo(!openModalInfo)
    // }
    
    // const handleExportData = () => {
    //     exportData(chartData[0] || null);
    // }

    // const buttons = buttonsData
    //     .filter((btn) => btn.mnemo !== 'full_screen')
    //     .map(button => {
    //         if (button.mnemo === 'export_data') {
    //             return {
    //                 ...button,
    //                 onClick: () => { return }
    //                 // onClick: handleExportData
    //             }
    //         }

    //         if (button.mnemo === 'full_chart') {
    //             return {
    //                 ...button,
    //                 onClick: toggleModalChartIsVisible
    //             }
    //         }

    //         if (button.mnemo === 'info') {
    //             return {
    //                 ...button,
    //                 onClick: toggleModalInfoIsVisible
    //             }
    //         }

    //         return button
    //     })
    //     .filter((btn) => !managerAvailable ? btn.mnemo !== 'info' : true)

    const memoOAIds = useMemo(() => {
        return oaIds
    }, [
        oaIds
    ])
    
    const memoAxisProps = useMemo(() => {
        return [{
            attributeIds: memoOAIds.map(item => {
                const obj = getObjectByIndex('id', item.objectId)
                
                return obj.object_attributes.find(oa => oa.id === item.oaId)?.attribute_id
            }),
            axisID: 'axisID',
            axisName: '',
            maxValue: undefined,
            minValue: undefined,
            unit: '',
        }]
    }, [
        memoOAIds
    ])

    const memoClassSettings = useMemo(() => {
        return classSettings
    }, [
        classSettings
    ])

    const memoPriorViewParams = useMemo(() => {
        const priorState = getPriorityState('object_attributes', memoOAIds.map(it => it.oaId))
        
        const params = getStateViewParamsWithDefault(priorState)

        return {
            color: params?.fill,
            borderColor: params?.border,
            textColor: params?.textColor,
        }
    }, [
        memoOAIds.map(oaItem => `${oaItem.oaId}-${oaItem.objectId}-${oaItem.visible}`).join('.'),
    ])

    const memoLegend = useMemo(() => {
        return {
            position: memoClassSettings?.legendPosition,
            layout: 'vertical' as 'horizontal' | 'vertical',
        }
    }, [
        memoClassSettings
    ])

    const memoAutoUpdate = useMemo(() => {
        return {
            enabled: false,
            time: 0
        }
    }, [
        memoClassSettings
    ])

    const memoButtons = useMemo(() => {
        return []
    }, [])

    const memoTitles = useMemo(() => {
        return memoOAIds
            .map(it => {
                const obj = getObjectByIndex('id', it.objectId)
                const currentOA = obj?.object_attributes.find(oa => oa.id === it.oaId)

                return `${currentOA?.attribute?.name} [${it.oaId}]`
            })
            .join(', ')
    }, [memoOAIds])

    const memoCommonSettings = useMemo(() => {
        return {
            legendWidth: ['bottom', 'top'].includes(memoClassSettings?.legendPosition) 
                ? `calc(${chartWidth} - 12px * 2 - 10%)` // 12px - padding, 10% - отступы от границы графика
                // ? '90%'
                // ? 200
                : 200 / gridCount,
            limit: commonSettings?.limit,
            dateIntervals: commonSettings?.dateInterval ?? [null, null],
            defaultPeriod: commonSettings?.defaultPeriod,
        }
    }, [
        memoClassSettings,
        commonSettings?.limit,
        commonSettings?.dateInterval?.join('.'),
        commonSettings?.defaultPeriod,
    ])

    const memoOAttrs = useMemo(() => {
        return memoOAIds.map(arrItem => {
            const currentObject = getObjectByIndex('id', arrItem.objectId)
            const currentOA = currentObject?.object_attributes.find(oa => oa.id === arrItem.oaId)

            return currentOA
        })
    }, [
        memoOAIds
    ])

    return (
        <MLErrorBoundary description="Ошибка в работе графика">
            <ObjectAttributeHistoryWrapper
                title={memoTitles}
                buttons={memoButtons}
                stateParams={memoPriorViewParams}
            >
                <MultipleChartContainer
                    background={background}
                    color={color} 
                    OAttrs={memoOAttrs}
                    axisProps={memoAxisProps}
                    legend={memoLegend}
                    autoUpdate={memoAutoUpdate}
                    commonSettings={memoCommonSettings}
                    height={memoClassSettings?.chartHeight}
                />
            </ObjectAttributeHistoryWrapper>
        </MLErrorBoundary>
    )
}
import { useEffect, useMemo, useState } from 'react'
import { roundNumberToPoint } from '@shared/utils/common'
import { IChartTypes, ICustomChartProps } from '@shared/ui/charts/highcharts/types'
import { CommonChart } from '@shared/ui/charts/highcharts/CommonChart'
import Highcharts from 'highcharts'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export interface IMultipleChartWrapperProps extends ICustomChartProps<Highcharts.SeriesLineOptions[]> {
    customYAxis?: Highcharts.YAxisOptions[]
    height?: number
}
export const ECMultipleChart: React.FC<IMultipleChartWrapperProps> = ({
    seriesData,
    customOptions,
    defaultSettings,
    /* customYAxis, */ height,
}) => {
    const currentSeries = useMemo(() => {
        return seriesData.map((serie) => ({ ...serie })) ?? []
    }, [seriesData])

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const textColor = createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'

    /* const renderYAxis: Highcharts.YAxisOptions[] = useMemo(() => {
        if (customYAxis) {
            return customYAxis
        } else {
            return currentSeries.map((serie, idx) => {
                // console.log('serie', serie)
                const unit = serie?.custom?.params?.unit ?? ''
                const valueConverter = serie?.custom?.params?.view?.value_converter
                const mainMax = valueConverter?.length 
                    ? valueConverter?.length - 1 
                    : 1
                const mainMin = 0
    
                const yAxisObject: Highcharts.YAxisOptions = {
                    labels: {
                        allowOverlap: false,
                        align: 'left', // нужно для резервирования места под лейблы
                        formatter: function() {
                            // console.log('yAxis label', this)
                            // если есть конвертер значений, то переименовать лейблы оси у
                            
                            
                            if (valueConverter) {
                                const newValue = valueConverter.find(item => item.source == this.value)
                                
                                // console.log('newValue', newValue)
    
                                return newValue?.converted
                            }
    
                            return `${this.value} ${unit ?? ''}`
                        }
                    },
                    max: mainMax,
                    min: mainMin,
                    id: `yAxis-${serie.custom?.params?.id}`,
                    lineWidth: 1,
                    margin: 5,
                    showLastLabel: true,
                }
    
                return yAxisObject
            })
        }
    }, [customYAxis, seriesData]) */

    // console.log('renderYAxis', renderYAxis)
    // console.log('currentSeries', currentSeries)
    // console.log('yAxis', renderYAxis)

    const [options, setOptions] = useState<Highcharts.Options>({
        // chart: {
        //     margin: [],
        //     // marginTop: 10,
        //     events: {
        //         render: function() {
        //             // console.log('chart', this)
        //         }
        //     }
        // },
        rangeSelector: {
            enabled: true,
        },
        series: [],
        // yAxis: renderYAxis,
    })

    useEffect(() => {
        let modifiedArray

        if (Array.isArray(customOptions?.yAxis)) {
            const yAxisLocal = [...customOptions.yAxis]

            modifiedArray = yAxisLocal.map((item) => ({
                ...item,
                lineColor: textColor,
                labels: {
                    ...item.labels,
                    style: { color: textColor },
                },
            }))
        }

        setOptions({
            ...options,
            // chart: {
            //     backgroundColor: backgroundColor,
            // },
            // legend: {
            //     itemStyle: {
            //         color: textColor
            //     }
            // },
            rangeSelector: {
                // inputStyle: {
                //     color: textColor
                // },
                labelStyle: {
                    color: textColor,
                },
            },
            yAxis: modifiedArray ?? customOptions?.yAxis,

            tooltip: {
                className: 'highcharts-tooltip-container',
                padding: 10,
                borderColor: '#000',
                backgroundColor: '#fff',
                borderWidth: 2,
                outside: false,
                // outside: true,
                shared: true,
                split: false,
                useHTML: true,
                distance: 20,
                // @ts-ignore
                formatter: function(this: { points }) {
                    // console.log('tooltip', this)

                    let tooltip = ''

                    this.points.map((point, idx) => {
                        const valueConverter = currentSeries[idx]?.custom?.params?.view?.value_converter
                        const value = valueConverter
                            ? valueConverter.find((vc) => vc.source === point.y)?.converted
                            : undefined
                        const serieIdx = currentSeries.findIndex((serie) => {
                            return serie?.custom?.params?.id === point?.series?.userOptions?.custom?.params?.id
                        })
                        // console.log('valueConverter', valueConverter)
                        // console.log('tooltip point', point)
                        // console.log('tooltip value', value)

                        tooltip += `
                            <span style="font-size: 1.2em; font-weight: bold; color: ${point.color}">
                                [${currentSeries[serieIdx]?.custom?.params?.id}]
                            </span> 
                            <span style="font-size: 1.2em; font-weight: bold; color: ${point.color}">
                                ${currentSeries[serieIdx]?.name}
                            </span> - 
                            <span style="font-size: 1.2em">
                                ${value ?? roundNumberToPoint(point.y)}
                            </span><br/> 
                        `
                    })

                    return tooltip
                },
            },
            // yAxis: renderYAxis,
        })
    }, [seriesData, customOptions, textColor, backgroundColor])

    return (
        <div
            style={{
                width: '100%',
                height,
            }}
        >
            <CommonChart
                chartType={IChartTypes.LINE}
                // seriesData={seriesData}
                seriesData={currentSeries}
                // customOptions={customOptions}
                customOptions={Highcharts.merge(customOptions, options)}
                defaultSettings={defaultSettings}
                commonSettings={{
                    height,
                }}
            />
        </div>
    )
}
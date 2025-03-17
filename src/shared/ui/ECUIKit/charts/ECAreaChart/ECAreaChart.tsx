import { useState } from 'react'
import { IChartTypes, ICustomChartProps } from '@shared/ui/charts/highcharts/types'
import { CommonChart } from '@shared/ui/charts/highcharts/CommonChart'
import Highcharts from 'highcharts'

export interface IMultipleChartWrapperProps extends ICustomChartProps<Highcharts.SeriesAreaOptions[]> {
}

const defaulTAreaCHartOptions: Highcharts.Options = {
    chart: {
        margin: [],
        events: {
            render: function() {
                // console.log('chart', this)
            }
        },
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false,
    },
    navigator: {
        enabled: false,
    },
    rangeSelector: {
        enabled: false,
    },
    series: [],
    
}

export const ECAreaChart: React.FC<IMultipleChartWrapperProps> = ({
    seriesData, customOptions, defaultSettings, /* customYAxis */
}) => {   
    // console.log('seriesData', seriesData)
    
    const [options, setOptions] = useState<Highcharts.Options>(defaulTAreaCHartOptions)

    /* useEffect(() => {
        setOptions({
            ...options,
            tooltip: {
                enabled: false,
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
                        const valueConverter = seriesData[idx]?.custom?.params?.view?.value_converter
                        const value = valueConverter 
                            ? valueConverter.find(vc => vc.source === point.y)?.converted
                            : undefined
                        const serieIdx = seriesData.findIndex(serie => {
                            return serie?.custom?.params?.id === point?.series?.userOptions?.custom?.params?.id
                        })
                        // console.log('valueConverter', valueConverter)
                        // console.log('tooltip point', point)
                        // console.log('tooltip value', value)
    
                        tooltip += `
                            <span style="font-size: 1.2em; font-weight: bold; color: ${point.color}">
                                [${seriesData[serieIdx]?.custom?.params?.id}]
                            </span> 
                            <span style="font-size: 1.2em; font-weight: bold; color: ${point.color}">
                                ${seriesData[serieIdx]?.name}
                            </span> - 
                            <span style="font-size: 1.2em">
                                ${value ?? roundNumberToPoint(point.y)}
                            </span><br/> 
                        `
                    })
    
                    return tooltip
                        
                },
            },
        })
    }, [
        seriesData, 
        customOptions
    ]) */

    return (
        <div style={{ width: '100%' }}>
            <CommonChart
                chartType={IChartTypes.AREA}
                seriesData={seriesData}
                customOptions={Highcharts.merge(options, customOptions)}
                defaultSettings={defaultSettings}
            />
        </div>
    )
}
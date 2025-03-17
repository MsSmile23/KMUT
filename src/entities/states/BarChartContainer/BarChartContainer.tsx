import { FC, useEffect, useMemo, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
interface IColumnChartContainer {
    data: any[]
    chartSettings?: {
        height?: number
        legendItemWidth?: number
        legendOffset?: number
        showPercents?: boolean
        textColor?: string
        backgroundColor?: string
    }
}
const BarChartContainer: FC<IColumnChartContainer> = ({ data, chartSettings }) => {
    const [seriesData, setSeriesData] = useState<{ series: number[]; categories: string[] }>(null)
    const options = useMemo(() => {
        return {
            chart: {
                type: 'bar',
                height: chartSettings?.height ? `${chartSettings?.height}px` : '320px',
                backgroundColor: chartSettings?.backgroundColor
            },
            title: {
                text: '',
                style: {
                    color: chartSettings?.textColor,
                },
            },
            xAxis: {
                categories: seriesData?.categories ?? [],
                labels: {
                    style: {
                        color: chartSettings?.textColor,
                    },
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    style: {
                        color: chartSettings?.textColor,
                    },
                },
                labels: {
                    style: {
                        color: chartSettings?.textColor,
                    },
                },
            },
            legend: {
                reversed: true,
                enabled: false,
                itemStyle: {
                    color: chartSettings?.textColor,
                },
            },
            plotOptions: {
                series: {
                    barWidth: 10,
                    maxPointWidth: 12, // Ширина баров в пикселях
                },
                bar: {
                    borderRadius: '8px',
                    dataLabels: {
                        enabled: true,
                        style: {
                            color: chartSettings?.textColor,
                        },
                    },
                },
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: '',
                    data: seriesData?.series ?? [],
                    color: 'rgb(46, 117, 255)',
                },
            ],
        }
    }, [seriesData, chartSettings]);
    

    useEffect(() => {
        const seriesData = []
        const categories = []

        data.forEach((item) => {
            const value = chartSettings?.showPercents ? item.percent : item.count

            seriesData.push(value)
            categories.push(item.name)
        })

        setSeriesData({ series: seriesData, categories: categories })
    }, [data, chartSettings])

    return (
        <HighchartsReact
            // ref={chartRef}
            highcharts={Highcharts}
            options={options}
            style={{ width: '100%', height: 'auto' }}
            // options={mergedOptionsWithData}
            // style={{ width: '100%', maxHeight: '80%' }}
        />
    )
}

export default BarChartContainer
import { FC, useEffect, useMemo, useState } from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
interface IColumnChartContainer {
    data: any[],
    chartSettings: {
        height?: number,
        legendItemWidth?: number,
        legendOffset?: number,
        showPercents?: boolean,
        maxValue?: number
        axisColor?: string
        labelColor?: string
        backgroundColor?: string
    }
}
const ColumnChartContainer: FC<IColumnChartContainer> = ({ data, chartSettings }) => {
    const [seriesData, setSeriesData] = useState<any[]>([])
    const options = useMemo(() => {
        return {
            chart: {
                type: 'column',
                height: `${chartSettings?.height}px` ?? '270px',
                plotBackgroundColor: chartSettings?.backgroundColor,
                backgroundColor: chartSettings?.backgroundColor
            },
            title: {
                align: 'left',
                text: '',
            },
            subtitle: {
                align: 'left',
                text: '',
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: {
                type: 'category',
                crosshair: true,
                labels: {
                    enabled: false,
                    style: {
                        color: chartSettings?.labelColor // Цвет подписей на оси X
                    }
                },
                lineWidth: 3,
                lineColor: chartSettings?.axisColor, // Цвет оси X
            },
            yAxis: {
                max: chartSettings?.maxValue ? Number(chartSettings?.maxValue) : undefined,
                offset: -2,
                crosshair: false,
                title: {
                    text: '',
                },
                lineWidth: 3,
                lineColor: chartSettings?.axisColor, // Цвет оси Y
                gridLineDashStyle: 'dash',
                gridLineColor: 'rgb(143, 143, 143)',
                labels: {
                    style: {
                        cursor: 'default',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: chartSettings?.labelColor // Цвет подписей на оси Y
                    }
                },
            },
            legend: {
                enabled: true,
                alignColumns: false,
                align: 'center',

                itemStyle: {
                    color: chartSettings?.labelColor
                },
                itemHoverStyle: {
                    color: chartSettings?.labelColor
                }
            },
            credits: {
                enabled: false,
            },
            plotOptions: {
          
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                        align: 'center',
                    },
                },
                column: {
                    borderRadius: 4,
                    dataLabels: {
                        enabled: true,
                        format: '{y}'
                    }
                },
            },
            tooltip: {
                enabled: true,
                shared: false,
                formatter: function() {
                    return `${this.series.userOptions.name}: ${this.series.userOptions.data[0]}`;
                },
            },
            series: seriesData,
        };
    }, [seriesData, chartSettings]);

    useEffect(() => {
        const localData = []

        data.forEach((item) => {

            const totalCount = data.reduce((accumulator, currentObject) => {
                return accumulator + currentObject.count;
            }, 0)

            const percent = item.count * 100 / totalCount

            const value = chartSettings.showPercents ? Number(percent.toFixed(2)) : item.count

            localData.push({
                name: item.value,
                data: [value],
                color: item.color,
            })
        })

        setSeriesData(localData)
    }, [data])

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

export default ColumnChartContainer
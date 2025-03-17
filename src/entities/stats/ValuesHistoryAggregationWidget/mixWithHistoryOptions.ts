import { ILineChart } from './lineChartProps'

export const mixWithHistoryWidgetOptions = (options: ILineChart): Partial<ILineChart> => {
    return {
        chart: {
            ...options.chart,
            type: 'column',
            marginLeft: 75,
        },
        plotOptions: {
            ...options.plotOptions,
            column: {
                ...options.plotOptions?.column,
                dataGrouping: {
                    enabled: false
                }
            },
            series: {
                ...options.series,
                //maxPointWidth: 30,
                dataLabels: {
                    ...options.plotOptions?.series?.dataLabels,
                    enabled: false
                },
                borderRadius: {
                    ...options.plotOptions?.series?.borderRadius,
                    radius: '8px'
                }
            }
        },
        xAxis: {
            ...options.xAxis,
            gridLineWidth: 1,
            type: 'datetime',
        },
        yAxis: {
            ...options.yAxis,
            opposite: false,
            labels: {
                align: 'right',
                // formatter: function (this: any) {
                //     return `<p style="transform:translate(25px, 6px);">${this.value}&nbsp;&nbsp;&#8212;</p>`;
                // },
                // useHTML: true,
                // shared: true
            }
        }
    }
}
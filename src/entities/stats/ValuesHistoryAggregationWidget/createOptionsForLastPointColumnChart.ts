import { findMaxPointY } from './findMaxPointY'
import { ILineChart } from './lineChartProps'

export const createOptionForLastPointColumnChart = (o: ILineChart) => {
    const series = o.series.map((serie) => {
        return {
            ...serie,
            data: serie.data.slice(-1),
            maxPointWidth: 100
        }
    })

    return {
        ...o,
        series,
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false,
        },
        xAxis: {
            ...o.xAxis,
            tickLength: 0,
            gridLineWidth: 0
        },
        yAxis: {
            ...o.yAxis,
            max: findMaxPointY(series)
        }
        
    }
}
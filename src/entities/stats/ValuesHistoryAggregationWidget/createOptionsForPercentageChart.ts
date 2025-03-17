import { ILineChart } from './lineChartProps'

export const createOptionsForPercentageChart = (o: ILineChart) => {
    const timestamps = {}

    // формируем сумму всех значений Y для каждого таймстемпа
    o.series.forEach((serie) => {
        serie.data.forEach((point: any) => {
            const dt = point[0]
            const y = point[1]

            timestamps[dt] = (timestamps?.[dt] || 0) + y 
        })
    })

    return {
        ...o,
        yAxis: {
            ...o.yAxis,
            max: 100
        },
        series: o.series.map((serie) => {
            return {
                ...serie,
                data: serie.data.map((point: any) => {
                    const [ dt, y ] = point

                    return [ dt, (y / timestamps[dt] * 100) ]
                })
            }
        }) as any
    }
}
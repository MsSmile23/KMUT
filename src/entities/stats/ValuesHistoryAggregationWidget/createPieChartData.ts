import { IPieChart } from './ValuesHistoryAggregationWidget'

// todo: typing
export const createPieChartData = (series: any[]) => {
    const pieData: IPieChart['data'] = []

    series
        .filter((serie) => serie.data.length !== 0)
        .forEach((serie) => {
            const color = typeof serie.color === 'string'
                ? serie.color
                : serie?.color?.stops?.[0]?.[1] || '#808080' 
    

            pieData.push({
                name: serie.name || '<нет названия>',
                y: Number(serie.data[serie.data.length - 1][1].toFixed(2)),
                color,
                nameGraph: ''
            })
        })

    return pieData
}
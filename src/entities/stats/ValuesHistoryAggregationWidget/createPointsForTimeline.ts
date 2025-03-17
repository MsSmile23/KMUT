
import moment from 'moment'
import { TGetStatsApiFunction } from './ValuesHistoryAggregationWidget'

type TTemp = {
    time: number,
    value: number,
    name: string,
    color: string
}

export const createPointsForTimeline = (series: TGetStatsApiFunction[]) => {
    const convert = (ts: number) => moment.unix(ts).format('YYYY-MM-DD HH:mm:ss') 

    const flatSeriesPoints: TTemp[] = []

    series.filter((serie) => serie.data.length !== 0).forEach((serie) => {
        serie.data.forEach((point) => {
            flatSeriesPoints.push({
                time: point[0],
                value: point[1],
                name: serie.name || '<нет названия>',
                color: serie.color
            })
        })
    })

    const sortedFlatSeriesPoints = [...flatSeriesPoints.sort((less, more) => less.time - more.time)]

    let tmpColor = ''
    const rangedPoints: {
        color: string,
        start_dt: string,
        end_dt: string,
        title: string
    }[] = []
    
    sortedFlatSeriesPoints.forEach((point) => {
        if (point.color !== tmpColor) {
            rangedPoints.push({
                color: point.color,
                title: point.name,
                start_dt: convert(point.time),
                end_dt: ''
            })

            tmpColor = point.color
        }
    })

    return rangedPoints.map((point, i, arr) => {
        return {
            ...point,
            end_dt: i === arr.length - 1 ? convert(Date.now() / 1000) : arr[i + 1].start_dt
        }
    })
}
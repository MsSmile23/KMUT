import { TGetStatsApiFunction } from './ValuesHistoryAggregationWidget'

export const createSeriesForMetricPoints = (data: TGetStatsApiFunction[]): TGetStatsApiFunction[] => {
    return data.map((item) => {
        if (item?.code?.includes('_rcv')) {
            return {
                ...item,
                name: 'Прием',
                color: '#5CB85C',
            }
        }
    
        if (item?.code?.includes('_trn')) {
            return {
                ...item,
                color: '#FF5959',
                name: 'Передача'
            }
        }
    
        if (item?.code) {
            const colors = ['#FF5959', '#0096FF', '#5CB85C']
    
            return {
                ...item,
                color: colors[Number(item.code)],
                name: item?.name || `Активность ${item.code}`,
                data: item.data.map(([ dt, y ]) => [dt, Number(y)])
            }
        }
    
        return item
    })
}
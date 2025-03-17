import { TGetStatsApiFunction, TValuesHistoryAggregationFields } from './ValuesHistoryAggregationWidget'
import { convertPointsArrayToObject } from './convertPointsArrayToObject'
import { getStackingVariant } from './getStackingVariant'
import { makeGradient } from './makeGradient'

export const convertRawSeriesForHighchart = (
    series: TGetStatsApiFunction[], 
    data: TValuesHistoryAggregationFields
) => {
    const stacking = getStackingVariant(data)

    // собираем все таймстемпы и удаляем дубли
    const allTimelinesTmpSet = new Set<number>()

    series.forEach((serie) => {
        serie.data.forEach(([ dt ]) => allTimelinesTmpSet.add(dt))
    })

    // все таймстемпы с пустыми значениями по Y для отображение столбцов с 0 
    const allTimelinesEmptyY = convertPointsArrayToObject(
        Array.from(allTimelinesTmpSet.values()).map((dt) => [dt, 0])
    )

    // todo: проверить типизацию modifiedSeries
    return series
        .map((item) => {
            const fulldata: [number, number][] = [...Object.entries({
                ...allTimelinesEmptyY,
                ...convertPointsArrayToObject(item.data)
            }).sort((a, b) => Number(a[0]) - Number(b[0]))].map(([ dt, y ]) => [Number(dt) * 1000, y])

            return {
                ...item,
                stacking,
                name: item?.name || '<нет названия>',
                color: stacking ? item.color : makeGradient(item.color),
                data: fulldata,
                showInNavigator: false,
                dataGrouping: {
                    enabled: false
                },
                pointPlacement: 'between',
                pointPadding: 0.05,
                groupPadding: 0.05,
                borderWidth: 0,
                shadow: false,
                maxPointWidth: 30,
            }
        })
}
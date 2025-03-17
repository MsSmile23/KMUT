
import { TGetStatsApiFunction } from './ValuesHistoryAggregationWidget'
import { createError } from './createError'

/**
 * Проверяет наличие невалидного таймстампа (числа) в данных для графика
 * @param series - массив объектов { name: string, color: string, data: [] }
 * @returns есть ли невалидный таймстемп в массиве
 */
export const validateTimestamps = (series: TGetStatsApiFunction[]) => {
    return Boolean(series.find((serie) => {
        return serie.data.find((points) => {
            if (!Array.isArray(points)) {
                createError('История значений: значения на являются массивом')

                return false
            }

            if (points.length > 2) {
                createError('История значений: количество значений в массиве больше двух')

                return false
            }

            if (points.some((p) => typeof p !== 'number')) {
                createError('История значений: время или значения не являются числами')

                return false
            }

            return true
        })
    }))
}
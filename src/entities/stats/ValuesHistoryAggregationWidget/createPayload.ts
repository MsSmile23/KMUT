import { createError } from './createError'
import { TValuesHistoryAggregationFields } from './ValuesHistoryAggregationWidget'
import { createTimeRange } from '@entities/stats/ValuesHistoryAggregationWidget/createTimeRange';

export const createPayload = (data: TValuesHistoryAggregationFields) => {
    const widgetType = 'История значений: '

    // if (!subjectId) {
    //     return createError(`${widgetType} отсутствует id субъекта`)
    // }
    if (data === undefined) {
        return createError(`${widgetType} неопределены данные запроса`)
    }

    const notAllFieldsCompleted = Object.entries(data)
        .filter(([ k ]) => k !== 'chartName')
        .filter(([ k ]) => k !== 'view')
        .filter(([ k ]) => k !== 'autoUpdated')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .some(([ _k, v ]) => v === undefined)

    if (notAllFieldsCompleted) {
        return createError(`${widgetType} не заполнены все поля`)
    }

    return {
        ...createTimeRange(data),
        subject_child_types: data.subjectChildTypes,
        group_by: data.groupBy,
        agg_type: data.aggregationType,
        depth: data.depth
    }

}
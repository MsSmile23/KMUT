import moment from 'moment'
import { createError } from './createError'
import { IValuesHistoryAggregationProps } from './ValuesHistoryAggregationWidget2'

export const createPayload2 = (data: IValuesHistoryAggregationProps) => {
    const widgetType = 'История значений: '

    // if (!subjectId) {
    //     return createError(`${widgetType} отсутствует id субъекта`)
    // }
    if (data === undefined) {
        createError(`${widgetType} неопределены данные запроса`)

        return {}
    }

    const createTimeRange = () => {
        if (data?.groupBy === 'minute' && data?.chart?.view !== 'timeline') {
            return {
                left_bound: moment().subtract(1, 'days').unix(),
                right_bound: moment().unix()
            }
        }

        if (data?.groupBy === 'minute' && data?.chart?.view === 'timeline') {
            return {
                left_bound: moment().subtract(1, 'hour').unix(),
                right_bound: moment().unix()
            }
        }

        if (data?.groupBy === 'hour') {
            return {
                left_bound: moment().subtract(1, 'week').unix(),
                right_bound: moment().unix()
            }
        }

        if (data?.groupBy === 'day') {
            return {
                left_bound: moment().subtract(1, 'month').unix(),
                right_bound: moment().unix()
            }
        }

        return {
            left_bound: 0,
            right_bound: 9999999999,
        }
    }

    return {
        ...createTimeRange(),
        source: data.source,
        source_object_id: data.sourceObjectId,
        source_class_id: data.sourceClassId,
        target_class_id: data.targetClassId,
        target_object_id: data.targetObjectId,
        relation_ids: data.relationIds,
        group_by: data.groupBy,
        rcv_attribute_id: data.attributeId.rcv,
        trn_attribute_id: data.attributeId.trn
    }

}
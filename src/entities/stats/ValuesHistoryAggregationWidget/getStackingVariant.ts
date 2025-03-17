import { TValuesHistoryAggregationFields } from './ValuesHistoryAggregationWidget'

export const getStackingVariant = (data: TValuesHistoryAggregationFields | undefined) => {
    // stacked вариант с долями значениями из бэкенд ответа
    if (data?.chartType === 'absolute') {
        return 'normal'
    }

    // stacked вариант с процентными долями значений к сумме значений в точке
    if (data?.chartType === 'percents') {
        return 'percent'
    }
}
import { IValuesHistoryAggregationProps } from './ValuesHistoryAggregationWidget2'

export const getStackingVariant2 = (data: IValuesHistoryAggregationProps | undefined) => {
    // stacked вариант с долями значениями из бэкенд ответа
    if (data?.chart?.type === 'absolute') {
        return 'normal'
    }

    // stacked вариант с процентными долями значений к сумме значений в точке
    if (data?.chart?.type === 'percents') {
        return 'percent'
    }
}
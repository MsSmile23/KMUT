import { SERVICES_ATTRIBUTE_HISTORY } from '@shared/api/AttributeHistory';
import { IObjectAttribute } from '@shared/types/objects';
import dayjs, { Dayjs } from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/ru'
import { IAttributeHistorySerie } from '@shared/types/attribute-history';
import { ATTR_STEREOTYPE } from '@shared/config/attr_stereotypes';
import { SERVICES_OBJECTS } from '@shared/api/Objects';

dayjs.locale('ru')
dayjs.extend(localeData)

export interface IAttributeAggregationValues {
    current: any
    min: number | string
    max: number | string
    average: number | string
    unit: string
    data: IAttributeHistorySerie['data']
}

interface IAggregationProps {
    oa: IObjectAttribute
    period: [Dayjs, Dayjs]
    signal?: any
}
export const getOAAggregationValues = async (props: IAggregationProps) => {
    const { oa, period, signal } = props

    /* const dateIntervals = [
        String(period 
            ? period[0].unix() 
            : dayjs().subtract(48 * 60 * 60, 'second').unix()
        ), 
        String(period 
            ? period[1].unix() 
            : dayjs().unix()
        )
    ] */

    let aggregationValues: IAttributeAggregationValues = {
        current: 0,
        min: 0,
        max: 0,
        average: 0,
        unit: '',
        data: [],
    }

    const newPeriods = [
        period, 
        period.length > 0, 
        period[0],
        !isNaN(period[0]?.unix()),
        period[1],
        !isNaN(period[1]?.unix()),
    ].every(Boolean)
        ? {
            start: String(period[0].unix()), 
            // start: dateIntervals[0], 
            end: String(period[1].unix()) 
            // end: dateIntervals[1] 
        } : null
    const payload = {
        id: oa.id,
        signal,
        ...newPeriods
    }

    const response = await SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById(payload)

    if (response.success) {
        if (response?.data !== undefined) {
            const serie = response?.data?.series[0]

            aggregationValues = {
                ...aggregationValues,
                unit: serie.unit,
                data: serie.data,
            }

            if (serie.data.length === 0) {
                aggregationValues = {
                    ...aggregationValues,
                    current: 'Нет значения',
                    min: 'Нет значения',
                    max: 'Нет значения',
                    average: 'Нет значения',
                }
            } else {
                if (!['integer', 'float', 'double'].includes(serie.data_type)) {

                    if (serie.data_type === 'string' && serie.params?.view?.value_converter) {
                        const value = serie.params.view.value_converter.find((item) => {
                            return item.source === serie.data[serie.data.length - 1][1]
                        })

                        aggregationValues = {
                            ...aggregationValues,
                            current: value ? value?.converted : 'Нет значения',
                            min: 'Нет значения',
                            max: 'Нет значения',
                            average: 'Нет значения',
                        }

                    /*  const convertedValues = serie.data?.reduce((acc, serieItem, idx) => {
                            const value = serieItem[1]
                            
                            if (typeof value === 'string') {
                                if (!acc[value]) {
                                    acc[value] = 1
                                } else {
                                    acc[value] = acc[value] + 1
                                }

                                if (idx === serie.data.length - 1) {
                                    aggregationValues.current = value
                                }
                
                            }
            
                            return acc
                        }, {}) */
                    } else {
                        aggregationValues = {
                            ...aggregationValues,
                            current: serie.data[serie.data.length - 1][1],
                            min: 'Нет значения',
                            max: 'Нет значения',
                            average: 'Нет значения',
                        }

                    }
                } else {
                    aggregationValues = serie.data?.reduce((acc, serieItem, idx) => {
                        const value = serieItem[1]

                        if (typeof value === 'number') {
                            if (idx === serie.data.length - 1) {
                                acc.current = value
                                acc.average = Math.floor((Number(acc.average) + value ) / serie.data.length * 100) / 100
                            } else {
                                acc.average = Number(acc.average) + value
                            }
            
                            acc.min = Number(acc.min) > value ? value : acc.min
                            acc.max = Number(acc.max) < value ? value : acc.max
                        } else if (typeof value === 'string') {
                            const roundedValue = (Math.round(Number(value) * 100)) / 100

                            if (idx === serie.data.length - 1) {
                                acc.current = roundedValue
                                // acc.current = Number(value)
                                // acc.current = parseInt(value)
                                acc.average = Math.floor(
                                    (Number(acc.average) + roundedValue ) / serie.data.length * 100
                                    // (Number(acc.average) + Number(value) ) / serie.data.length * 100
                                    // (Number(acc.average) + parseInt(value) ) / serie.data.length * 100
                                ) / 100
                            } else {
                                acc.average = Number(acc.average) + roundedValue
                                // acc.average = Number(acc.average) + Number(value)
                                // acc.average = Number(acc.average) + parseInt(value)
                            }
            
                            acc.min = Number(acc.min) > roundedValue ? roundedValue : acc.min
                            // acc.min = Number(acc.min) > Number(value) ? Number(value) : acc.min
                            // acc.min = Number(acc.min) > parseInt(value) ? parseInt(value) : acc.min
                            acc.max = Number(acc.max) < roundedValue ? roundedValue : acc.max
                            // acc.max = Number(acc.max) < Number(value) ? Number(value) : acc.max
                            // acc.max = Number(acc.max) < parseInt(value) ? parseInt(value) : acc.max
                        }
        
                        return acc
                    }, aggregationValues)

                    if (serie.params?.view?.value_converter) {
                        const converters = serie.params.view.value_converter.reduce((acc, item) => {
                            acc[item.source] = item.converted

                            return acc
                        }, {})

                        aggregationValues = {
                            ...aggregationValues,
                            current: converters[aggregationValues.current],
                            min: converters[aggregationValues.min],
                            max: converters[aggregationValues.max],
                            average: '',
                        }
                    }
                }
            }

           

        }
    }

    return aggregationValues
}

export const compareOAWithValue = (oa: IObjectAttribute, value) => {
    if (oa?.attribute?.data_type?.inner_type == 'boolean') {
        const compareValue = (oa?.attribute_value === '1') ? true : false

        return value === compareValue
    }

    return value === oa?.attribute_value
}

/**
 * Находит необходимый атрибут объекта по мнемонике
 * 
 * @param identifier - мнемоника стереотипа
 * @param objectAttributes - массив атрибутов объекта
 * @returns атрибут объекта
 */
export const findObjectAttributeByStereotype = (
    mnemo: string, //keyof typeof ATTR_STEREOTYPE,
    objectAttributes: IObjectAttribute[]
) => objectAttributes?.find((oa) => oa.attribute?.attribute_stereotype?.mnemo === ATTR_STEREOTYPE?.[mnemo])

/**
 * Функция фильтрует атрибуты объекта по признаку показывать/не показывать представления измерений
 * @param unfilteredObjectAttributes - массив атрибутов объекта
 * @returns {success: boolean, data: IObjectAttribute[]}
 */

export const getOAsForShow = async (
    unfilteredObjectAttributes: IObjectAttribute[]
): Promise<{ success: boolean, data: IObjectAttribute[] }> => {
    const idsFilter = unfilteredObjectAttributes.map(oa => oa.id)
    const oaShowResp = await SERVICES_OBJECTS.Models.getObjectAttributes({ all: true, ['filter[id]']: idsFilter })
    let objectAttributes = unfilteredObjectAttributes

    if (oaShowResp.success) {
        const showIdsFilter = oaShowResp.data.reduce( (acc, oa) => {
            if (oa.show) { acc.push(oa.id) }

            return acc
        }, [])

        objectAttributes = objectAttributes?.filter( oa => showIdsFilter.includes(oa.id))
    }

    return { success: oaShowResp.success, data: objectAttributes }
}
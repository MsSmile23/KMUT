import { FC, useEffect, useState } from 'react'
import { ECPlatesColumnChart } from '@shared/ui/ECUIKit/charts'
import { TECPlatesColumnChart } from '@shared/ui/ECUIKit/charts/ECPlatesColumnChart/types'
import { IObjectAttribute } from '@shared/types/objects'
import { getStateRulesFlatByIds } from '@shared/api/Attribute/Models/getStateRulesFlatByIds/getStateRulesFlatByIds'
import { jsonParseAsObject } from '@shared/utils/common'

interface IObjectAttributeWithShowAttrValue extends IObjectAttribute {
    showAttrValue?: string;
}

type TECPlatesColumnChartContainer = {
    oAttributes: IObjectAttributeWithShowAttrValue[],
    settings?: {
        renderWithTransparentColumn?: boolean,
        customUnit?: string | false,
        step?: number,
        width?: number | null,
        height?: number | null,
        pointWidth?: number | null,
        onlyActiveColor?: boolean
        prefix?: string 
        postfix?: string 
    }
    inverted?: boolean,
    fontSize?: number
}

const ECPlatesColumnChartContainer: FC<TECPlatesColumnChartContainer> = ({ 
    oAttributes, 
    settings: {
        renderWithTransparentColumn = true,
        customUnit = false,
        step = 10,
        width = null,
        height = null,
        pointWidth = null,
        onlyActiveColor = false,
        prefix,
        postfix
    },
    fontSize,
    inverted = false,
}) => {
    const [preparedData, setPreparedData] = useState<TECPlatesColumnChart['data']>(null)
    
    const prepareData = async (): Promise<TECPlatesColumnChart['data']> => {

        const intervalColors = {}

        //Формируем intervalColors
        const stateRuleToIntervalColors = (oAttrStatesRules) => {
            const { attribute_id, states } = oAttrStatesRules.shift()

            if (states.length < 1) {
                intervalColors[attribute_id] = [
                    {
                        range: { start: 60, end: 100 },
                        activeColor: 'rgba(255, 89, 89, 1)',
                        inactiveColor: 'rgba(255, 89, 89, 0.1)'
                    },
                    {
                        range: { start: 0, end: 30 },
                        activeColor: 'rgba(106, 190, 106, 1)',
                        inactiveColor: 'rgba(106, 190, 106, 0.1)'
                    },
                    {
                        range: { start: 30, end: 60 },
                        activeColor: 'rgba(255, 199, 0, 1)',
                        inactiveColor: 'rgba(255, 199, 0, 0.1)'
                    }
                ]
            }

            if (states.length > 0) {
                intervalColors[attribute_id] = states.map(({ rule, color }) => {

                    const min = rule?.min_include ? 
                        rule?.min == null ? 0 : rule?.min 
                        : rule?.min == null ? 0 : rule?.min - 1
                        
                    const max = rule?.max_include
                        ? (rule?.max == null ? (rule?.min > 100 ? 99999 : 100) : rule?.max)
                        : (rule?.max == null ? (rule?.min > 100 ? 99999 : 100 - 1) : rule?.max - 1);

                    return {
                        range: {
                            start: min,
                            end: max
                        },
                        activeColor: color,
                        inactiveColor: `${color}40`
                    }
                });
            }

            if (oAttrStatesRules.length > 0) {
                stateRuleToIntervalColors(oAttrStatesRules)
            }
        }

        //Формируем массив данных из данных атрибута в данные для chart accum.dataForChart
        //Формируем массив идентификаторов(id) с сохранением порядка accum.oAttrIdsForStateRulesFlat
        const data = oAttributes.reduce((accum, oAttr) => {
            const params = jsonParseAsObject(oAttr?.attribute?.view_type?.params)

            const parsedValue = jsonParseAsObject(oAttr?.attribute_value)
            const customAxisName = (index: string) => {
                return (prefix || postfix)
                    ? `${prefix ?? ''}${index}${postfix ?? ''}`
                    : `${oAttr?.showAttrValue?.length > 0 
                        ? oAttr?.showAttrValue 
                        : oAttr?.attribute?.name}`
            }

            // Если пришёл массив величин, то преобразовываем его из экранированной строки
            if (typeof parsedValue === 'object') {
                const valueData = Array.isArray(parsedValue)
                    ? parsedValue
                    : Object.entries(parsedValue)

                valueData.forEach(([key, val], idx) => {
                    

                    accum.forChart.push({
                        attribute_id: oAttr?.attribute_id,
                        renderWithTransparentColumn: renderWithTransparentColumn,
                        step: Number(step),
                        data: [
                            {
                                value: Number(val) || '',
                                categoryNameXAxis: customAxisName(`${key}`),
                                // categoryNameXAxis: customAxisName(`${idx + 1}`),
                            }
                        ],
                        unit: customUnit || oAttr?.attribute?.unit || '',
                        interval: {
                            start: params?.min || 0,
                            end: params?.max || 100
                        }
                    })
                    accum.oAttrIdsForStateRulesFlat.push(Number(oAttr.attribute_id))
                })

            // Иначе собираем по атрибутам дочерних объектов
            } else {
                // if (oAttr?.attribute_value) {
                //     oAttr['attribute_value'] = undefined
                // }
    
                  
                accum.forChart.push({
                    attribute_id: oAttr?.attribute_id,
                    renderWithTransparentColumn: renderWithTransparentColumn,
                    step: Number(step),
                    data: [
                        {
                            value: Number(oAttr?.attribute_value) || '',
                            categoryNameXAxis: customAxisName(''),
                        }
                    ],
                    unit: customUnit || oAttr?.attribute?.unit || '',
                    interval: {
                        start: params?.min || 0,
                        end: params?.max || 100
                    }
                })
                accum.oAttrIdsForStateRulesFlat.push(Number(oAttr.attribute_id))
            }
            

            return accum
        }, { forChart: [], oAttrIdsForStateRulesFlat: [] })

        // eslint-disable-next-line max-len
        const oAttrStateRulesFlat = await getStateRulesFlatByIds((data.oAttrIdsForStateRulesFlat).join('&attribute_ids[]='))
        const oAttrStatesRules = oAttrStateRulesFlat.data?.length > 0 
            ? oAttrStateRulesFlat.data 
            : null

        if (!oAttrStatesRules) {
            data.oAttrIdsForStateRulesFlat.forEach((attribute_id, index) => {
                data.forChart[index]['intervalColors'] = [
                    {
                        range: { start: 60, end: 100 },
                        activeColor: 'rgba(255, 89, 89, 1)',
                        inactiveColor: 'rgba(255, 89, 89, 0.1)'
                    },
                    {
                        range: { start: 0, end: 30 },
                        activeColor: 'rgba(106, 190, 106, 1)',
                        inactiveColor: 'rgba(106, 190, 106, 0.1)'
                    },
                    {
                        range: { start: 30, end: 60 },
                        activeColor: 'rgba(255, 199, 0, 1)',
                        inactiveColor: 'rgba(255, 199, 0, 0.1)'
                    }
                ]
            })

            return data.forChart
        }
        //Формирование отрезков цветов
        stateRuleToIntervalColors(oAttrStatesRules)

        data.oAttrIdsForStateRulesFlat.forEach((attribute_id, index) => {
            data.forChart[index]['intervalColors'] = intervalColors[attribute_id] || [
                {
                    range: { start: 30, end: 60 },
                    activeColor: 'rgba(255, 199, 0, 1)',
                    inactiveColor: 'rgba(255, 199, 0, 0.1)'
                },
                {
                    range: { start: 60, end: 100 },
                    activeColor: 'rgba(255, 89, 89, 1)',
                    inactiveColor: 'rgba(255, 89, 89, 0.1)'
                },
                {
                    range: { start: 0, end: 30 },
                    activeColor: 'rgba(106, 190, 106, 1)',
                    inactiveColor: 'rgba(106, 190, 106, 0.1)'
                }
            ]
        })

        return data.forChart.sort((a, b) => a?.data[0]?.categoryNameXAxis?.localeCompare(b?.data[0]?.categoryNameXAxis))
        // return data.forChart
    }

    useEffect(() => {
        //Если есть oAttributes
        if (oAttributes && oAttributes !== null && oAttributes.length > 0) {
            prepareData().then((forChart) => {
                setPreparedData(forChart)
            })
        }
    }, [oAttributes])

    if (!oAttributes && oAttributes == null && oAttributes.length < 1) {
        return <div>Нет измерений</div>
    }

    return (
        <ECPlatesColumnChart
            data={preparedData}
            height={height}
            width={width}
            pointWidth={pointWidth}
            inverted={inverted}
            fontSize={fontSize}
            onlyActiveColor={onlyActiveColor}
        />
    )
}

export default ECPlatesColumnChartContainer
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
import { StateLabel } from '@entities/states/StateLabels'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { useInterval } from '@shared/hooks/useInterval'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { IAttributeHistorySerie } from '@shared/types/attribute-history'
import { IObjectAttribute } from '@shared/types/objects'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { getOAAggregationValues, IAttributeAggregationValues } from '@shared/utils/objectAttributes'
import { getPriorityState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { Dayjs } from 'dayjs'
import { FC, useEffect, useState, CSSProperties } from 'react'

export interface IObjectOAttrStateWithAggregationProps {
    objectAttribute: IObjectAttribute
    icon?: IECIconView['icon']
    aggrValues?: IAttributeAggregationValues
    //Общие настройки лейбла
    labelSettings?: {
        showName: boolean,
    }
    //Настройки вывода значения измерения
    value?: {
        enabled?: boolean
        aggregation?: 'current' | 'max' | 'min' | 'average'
        period?: [Dayjs, Dayjs]
    }
    maxWidth?: boolean
    customStyle?: CSSProperties
    autoUpdate?: {
        enabled: boolean
        time: number
    }
    showOnlyState?: boolean
    currentName?: string
    valNextLine?: boolean
    noAttributeTitle?: string
}

export const ObjectOAttrStateWithAggregation: FC<IObjectOAttrStateWithAggregationProps> = ({
    objectAttribute,
    icon,
    value,
    aggrValues,
    maxWidth,
    customStyle,
    labelSettings = {
        showName: true
    },
    autoUpdate = {
        enabled: true,
        time: 60_000
    },
    showOnlyState = false,
    currentName,
    valNextLine = false,
    noAttributeTitle = 'Нет атрибута'
}) => {
    const [aggregationValues, setAggregationValues] = useState<{
        current: number | string
        min: number | string
        max: number | string
        average: number | string
        unit: string
        data: IAttributeHistorySerie['data']
    }>({
        current: 0,
        min: 0,
        max: 0,
        average: 0,
        unit: '',
        data: []
    })
    const [attributeValue, setAttributeValue] = useState('')

    const { forceUpdate } = useStateEntitiesStore()
    const state = objectAttribute ? getPriorityState('object_attributes', [objectAttribute]) : null
    const currentValue = {
        enabled: value?.enabled ?? false,
        aggregation: value?.aggregation ?? 'current',
        period: value?.period ?? [null, null]
        // period: value?.period ?? [
        //     dayjs().subtract(48 * 60 * 60, 'second'),
        //     dayjs()
        // ] as [Dayjs, Dayjs],
    }

    const loadData = async () => {
        if (aggrValues) {
            setAggregationValues(aggrValues)
        } else {
            if (objectAttribute) {
                if (value.aggregation === 'current') {
                    SERVICES_OBJECTS.Models.getObjectAttributes({
                        all: true,
                        ['filter[id]']: [objectAttribute?.id]
                    }).then(response => {
                        if (response.success &&
                            response.data &&
                            response.data.length > 0
                        ) {
                            const unit = objectAttribute?.attribute?.unit ?? ''
                            const params = objectAttribute?.attribute?.view_type?.params
                            const currentValue = response.data[0]?.attribute_value
                            // Если есть params, то парсим value_converter
                            const value_converter = params && JSON.parse(params)?.value_converter
                            // Если value_converter есть, то ищем конкретный source
                            const currentSource = value_converter?.find(item => item.source == currentValue)
                            // Присваиваем текущее значения в зависимости от наличия value_converter у неё
                            const parsedCurrentValue = value_converter
                                ? currentSource?.converted
                                : currentValue

                            setAggregationValues(state => ({
                                ...state,
                                current: parsedCurrentValue

                            }))

                            const newValue = parsedCurrentValue
                                ? `${parsedCurrentValue} ${unit}`
                                : '-'

                            setAttributeValue(newValue)
                        } else {
                            setAttributeValue('-')
                        }
                    })
                } else {
                    getOAAggregationValues({
                        oa: objectAttribute,
                        period: currentValue.period
                    }).then((data) => {

                        if (aggregationValues[value?.aggregation] !== data[value?.aggregation]) {
                            forceUpdate()
                        }


                        setAggregationValues(data)
                        const unit = data.unit !== null ? data.unit : ''
                        const newValue = currentValue
                            ? data[currentValue.aggregation] !== 'Нет значения'
                                ? `${data[currentValue.aggregation]} ${unit}`
                                : ''
                            : ''

                        setAttributeValue(newValue)
                    })
                }
            }
        }
    }


    useInterval(() => { 
        loadData().then()
    }, (autoUpdate && autoUpdate.enabled) ? autoUpdate.time : null)

    useEffect(() => {
        loadData().then()
    }, [objectAttribute])

    const showValue = valNextLine
        ? (
            <div
                style={{
                    width: '100%',
                    padding: '0 5px',
                    textAlign: 'center',
                }}
            >
                <span 
                    style={{ 
                        textOverflow: 'ellipsis', 
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap',
                        width: 'calc(100% - 0px)',
                        display: 'block'
                    }}
                >
                    {showOnlyState
                        ? getStateViewParamsWithDefault(state).name
                        : (labelSettings.showName)
                            ? `${objectAttribute?.attribute?.name}${currentName ? ` (${currentName})` : ''}:`
                            : `${currentName ? ` (${currentName})` : ''}`}
                </span>
                <span>
                    {attributeValue}
                </span>
            </div>
        ) : (
            <span 
                style={{ 
                    textOverflow: 'ellipsis', 
                    overflow: 'hidden', 
                    whiteSpace: 'nowrap' 
                }}
            >
                {
                    showOnlyState
                        ? getStateViewParamsWithDefault(state).name
                        : (labelSettings.showName)
                            ? `${objectAttribute?.attribute?.name}${currentName ? ` (${currentName})` : ''}: ${attributeValue}`
                            : `${attributeValue}${currentName ? ` (${currentName})` : ''}`
                }
            </span>
        )

    return objectAttribute 
        ? (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    gap: 10,
                    width: '100%',
                }}
            >
                <StateLabel
                    state={state}
                    title={currentName
                        ? `${objectAttribute?.attribute?.name} (${currentName})`
                        : objectAttribute?.attribute?.name}
                    // showStateName={labelSettings.showName}
                    wrapperStyles={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 5,
                        width: '100%',
                        ...customStyle
                    }}
                    maxWidth={maxWidth}
                >
                    {icon && (
                        <ECIconView
                            icon={icon}
                            style={{
                                // color: getStateViewParamsWithDefault(state).textColor,
                                // color: '#ffffff' 
                            }}
                        />)}
                    {showValue}
                </StateLabel>
            </div>
        ) : (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}
            >
                {noAttributeTitle}
            </div>
        )
}
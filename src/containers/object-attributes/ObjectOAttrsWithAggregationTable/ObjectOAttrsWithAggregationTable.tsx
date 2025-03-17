import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IAttribute } from '@shared/types/attributes'
import { IObject, IObjectAttribute } from '@shared/types/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { IAttributeAggregationValues, getOAAggregationValues } from '@shared/utils/objectAttributes'
import { Spin } from 'antd'
import { FC, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/ru'
import { getColumns, getRows } from './utils'
import { IEditTableProps } from '@shared/ui/tables/ECTable2/EditTable/types'
import { findChildObjectsByBaseClasses } from '@shared/utils/objects'
import { IClass } from '@shared/types/classes'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { useInterval } from '@shared/hooks/useInterval'
import { useStateEntitiesStore } from '@shared/stores/state-entities';
// import { useStateEntitiesStore } from '@shared/stores/state-entities'
dayjs.locale('ru')
dayjs.extend(localeData)

export type IOAWithAggregation = Record<string, {
    objAttr: IObjectAttribute
    aggr: IAttributeAggregationValues
}>
// ObjectOAttrsWithAggregationTable принимает следующие пропсы
// objectId - id объекта, 
// attributes - необязательный массив атрибутов для отображения конкретных аттрибутов
// aggregations - набор отображаемых значений агрегации (текущее - должно быть всегда включено, 
// также максимальное, минимальное и среднее)
// viewType - тип отображения (пока только таблица)
// period - период агрегации в секундах
export interface IObjectOAttrsWithAggregationTableProps {
    objectId: IObject['id']
    attributes?: IAttribute['id'][]
    aggregations: ('current' | 'max' | 'min' | 'average')[]
    viewType: 'table'
    period?: [Dayjs, Dayjs]
    autoUpdate?: {
        enabled: boolean
        time: number
    },

    linkedMetrics?: {
        mode: 'CHILD' | 'OBJECT_AND_CHILD',
        targetClassIds: IClass['id'][],
        attrIds?: IAttribute['id'][]
    }
}
export const ObjectOAttrsWithAggregationTable: FC<IObjectOAttrsWithAggregationTableProps> = ({
    objectId,
    attributes,
    aggregations,
    viewType = 'table',
    period = [
        null,
        null
    ],
    autoUpdate = {
        enabled: true,
        time: 600_000
    },
    linkedMetrics
}) => {   
    const frontFormat = 'HH:mm:ss DD.MM.YYYY'

    const stateEntitiesStore = useStateEntitiesStore()

    const initialDateIntervals: [Dayjs, Dayjs] = [
        null,
        null
    ]
    // const initialDateIntervals: [Dayjs, Dayjs] = [
    //     dayjs().subtract(48 * 60 * 60, 'second'),
    //     dayjs()
    // ]
    const dateIntervals = period 
        ? period
        : initialDateIntervals

    //const columns = getColumns(aggregations, (linkedMetrics) ? true : false)

    const getByIndex = useObjectsStore(selectObjectByIndex)
    // const { forceUpdate } = useStateEntitiesStore()

    const currentObject = getByIndex('id', objectId)
    const objects: IObject[] = []

    if (linkedMetrics?.mode === 'OBJECT_AND_CHILD' || linkedMetrics === undefined) {
        objects.push(currentObject)
    }

    //Ищем дочерние объекты
    if (linkedMetrics) {
        findChildObjectsByBaseClasses({
            childClassIds: linkedMetrics.targetClassIds,
            currentObj: currentObject,
            targetClassIds: linkedMetrics.targetClassIds,
        })?.forEach(oid => objects.push(getByIndex('id', oid)))
    }

    const columns = getColumns(
        aggregations,
        (linkedMetrics)
            ? ['currentId', 'objectName', 'name', 'status', ...aggregations, 'chart']
            : ['currentId', 'name', 'status',  ...aggregations, 'chart']
    )

    // Показываем только атрибуты с историей (history_to_db === true)
    // Если пришёл список отображаемых атрибутов, фильтруем список атрибутов объекта согласно ему
    // или показываем все атрибуты
    let unfilteredObjectAttributes: IObjectAttribute[] = []

    objects.forEach(currentObject => {
        const tmpOAs = currentObject?.object_attributes?.filter(oa => {
            const isInAttributes = attributes?.length > 0
                ? attributes.includes(oa.attribute_id)
                : true

            return isInAttributes && oa.attribute?.history_to_db
        }) || []

        unfilteredObjectAttributes = [...unfilteredObjectAttributes,  ...tmpOAs]
    })

    const [aggrValues, setAggrValues] = useState<IOAWithAggregation>({})
    const [loadState, setLoadState] = useState<'loading' | 'idle' | 'finished'>('idle')
    const [rows, setRows] = useState<IEditTableProps['rows']>([])
    const [firstLoading, setFirstLoading] = useState(false)
    const controller = new AbortController()
    const loadData = async () => {
        setLoadState('loading')
        //фильтруем атрибуты измерений для показа
        const response = await SERVICES_OBJECTS.Models.getObjectAttributes({ 
            all: true, 
            ['filter[id]']: unfilteredObjectAttributes?.map(oa => oa.id) 
        })
        let newAttributes = []

        if (response.success && 
            response.data && 
            response.data.length > 0
        ) {
            newAttributes = response.data.reduce((acc, attr) => {
                const stateEntity = stateEntitiesStore.getAttributeStateEntityById(attr.id)

                if (attr.show && stateEntity) {
                    const idx = unfilteredObjectAttributes.findIndex(oa => oa.id === attr.id)

                    acc.push({
                        ...unfilteredObjectAttributes[idx],
                        attribute_value: attr.attribute_value,
                        attribute: {
                            ...unfilteredObjectAttributes[idx].attribute,
                            
                        }
                    })
                }

                return acc
            }, [] as IObjectAttribute[])
        }


        //*Сортируем атрибуты либо по class_atributes order, либо по sort_order атрибута 
        const sortAttributes = (a, b) => {
            const sortByClassAttributeA =
                a?.attribute?.classes_ids.find((cl) => cl == currentObject?.class_id)?.order || a?.attribute?.sort_order
            const sortByClassAttributeB =
                b?.attribute?.classes_ids.find((cl) => cl == currentObject?.class_id)?.order || b?.attribute?.sort_order

            // Сортируем по полю sort
            return sortByClassAttributeA - sortByClassAttributeB
        }
        const objectAttributes  = unfilteredObjectAttributes.length > 0
            ? newAttributes.sort(sortAttributes)
            // ? (await UTILS.OA.getOAsForShow(unfilteredObjectAttributes))?.data
            : []

        //const objectAttributes = unfilteredObjectAttributes

        // Динамически заполняем массив данными агрегации по каждому атрибуту, если массив атрибутов не пустой

        if (objectAttributes.length > 0) {
            setAggrValues({})

            if (aggregations.filter(a => a !== 'current').length > 0)  {
                Promise.all(objectAttributes.map(oa => getOAAggregationValues({
                    oa, 
                    period: dateIntervals, 
                    signal: controller.signal
                })))
                    .then(result => {
                        const values = objectAttributes.reduce((acc, oa, idx) => {
                            acc[oa.id] = {
                                objAttr: oa,
                                aggr: result[idx]
                            }

                            return acc
                        }, {})

                        setAggrValues(values)
                        const oaHash = objectAttributes.reduce((acc, oa) => {
                            acc[oa.id] = oa?.object_id

                            return acc
                        }, {} as Record<IObjectAttribute['id'], IObject['id']>)

                        //const rows = getRows(values, aggregations, columns, period)
                        const rows = getRows({ 
                            aggrValues: values, 
                            aggregations, 
                            columns,
                            period,
                            oattributes: objectAttributes
                        })


                        setRows(rows.map(row => ({
                            ...row,
                            objectName:
                                (oaHash?.[row.id])
                                    ? getByIndex('id', oaHash?.[row.id])?.name ?? '-'
                                    : '-'
                        })))

                        if (!firstLoading) {
                            setFirstLoading(true)
                        }
                        setLoadState('finished')
                    })
                    /* .catch(error => {
                        if (error.name === 'AbortError') {
                            console.log('One or more fetch requests aborted');
                        } else {
                            console.error('One or more fetch requests failed:', error);
                        }
                    }); */
            } else {
                const values = objectAttributes.reduce((acc, oa) => {         
                    const unit = oa.attribute?.unit ?? ''
                    const params = oa.attribute.view_type?.params
                    const currentValue = oa.attribute_value
                    // Если есть params, то парсим value_converter
                    const value_converter = params && JSON.parse(params)?.value_converter
                    // Если value_converter есть, то ищем конкретный source
                    const currentSource = value_converter?.find(item => item.source === currentValue)
                    // Присваиваем текущее значения в зависимости от наличия value_converter у неё
                    const parsedCurrentValue = value_converter 
                        ? currentSource?.converted
                        : currentValue

                    acc[oa.id] = {
                        objAttr: oa,
                        aggr: {
                            current: parsedCurrentValue ?? 'Нет значения',
                            min: 'Нет значения',
                            max: 'Нет значения',
                            average: 'Нет значения',
                            data: [],
                            unit: unit
                        }
                    }

                    return acc
                }, {} as IOAWithAggregation)

                setAggrValues(values)
                const oaHash = objectAttributes.reduce((acc, oa) => {
                    acc[oa.id] = oa?.object_id

                    return acc
                }, {} as Record<IObjectAttribute['id'], IObject['id']>)

                //const rows = getRows(values, aggregations, columns, period)
                const rows = getRows({ 
                    aggrValues: values, 
                    aggregations, 
                    columns,
                    period,
                    oattributes: objectAttributes
                })


                setRows(rows.map(row => ({
                    ...row,
                    objectName:
                        (oaHash?.[row.id])
                            ? getByIndex('id', oaHash?.[row.id])?.name ?? '-'
                            : '-'
                })))

                if (!firstLoading) {
                    setFirstLoading(true)
                }
                setLoadState('finished')
            }

        } else {
            setAggrValues({})
            
            if (!firstLoading) {
                setFirstLoading(true)
            }
            setLoadState('finished')
        }
    }


    useInterval(() => { 
        loadData().then()
    }, (autoUpdate && autoUpdate.enabled) ? autoUpdate.time : null)

    useEffect(() => {
        return () => { controller.abort() }
    }, [])

    useEffect(() => {
        loadData().then()
    }, [
        objectId,
        attributes,
        aggregations,
        viewType,
        period,
        // OAttrs
    ])

    /*
    useEffect(() => {
        console.log('period', period)
    }, [
        period,
    ]) */

    // Отслеживаем изменение данных агрегации и пересобираем строки таблицы
    /* useEffect(() => {
        setRows(getRows(aggrValues, aggregations, columns, period))
    }, [
        aggrValues,
        aggregations,
        period
    ]) */

    const defaultTimestamps = Object.values(aggrValues).reduce((acc, av) => {
        if (av.aggr.data.length > 0 && 
            av.aggr.data?.[0]?.[0] && 
            av.aggr.data?.[av.aggr.data.length - 1]?.[0]
        ) {
            // data приходит в порядке от последней к первой
            const first = av.aggr.data?.[0]?.[0]
            const last = av.aggr.data?.[av.aggr.data.length - 1]?.[0]

            acc.end = first > last ? first : last
            acc.start = first > last ? last : first
        }

        return acc
    }, {
        start: undefined,
        end: undefined
    })

    const start = !isNaN(dateIntervals[0]?.unix()) 
        ? dateIntervals[0].format(frontFormat)
        : defaultTimestamps.start 
            ? dayjs(Number(defaultTimestamps.start * 1000)).format(frontFormat)
            : ''
    // : dayjs(Number(aggrValues?.[OAttrs[0]]?.aggr?.firstPointTimestamp * 1000))
    const end = !isNaN(dateIntervals[1]?.unix())
        ? dateIntervals[1].format(frontFormat)
        : defaultTimestamps.end
            ? dayjs(Number(defaultTimestamps.end * 1000)).format(frontFormat)
            : ''
    // : dayjs(Number(aggrValues?.[OAttrs[0]]?.aggr?.lastPointTimestamp * 1000))
    const tableTitle = defaultTimestamps.start && defaultTimestamps.end 
        && (
            <div>
                Данные за период с <u>{start}</u> по <u>{end}</u>
            </div>
        )

    switch (viewType) {
        case 'table': {            
            return ( 
                <div 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: loadState === 'loading' ? 'center' : 'flex-start',
                        width: '100%',
                        overflow: 'auto',
                    }}
                >
                    {loadState === 'loading' && !firstLoading
                        ? <Spin />
                    // {loadState === 'finished' &&  (
                        : (
                            <>
                                <div 
                                    style={{ 
                                        width: '100%', 
                                        textAlign: 'end' 
                                    }}
                                >
                                    {tableTitle}
                                </div>
                                <EditTable
                                    // pagination={false}
                                    // paginator={null}
                                    tableId="aggregationTable"
                                    rows={rows}
                                    // rows={rows.sort((a, b) => {
                                    //     return a.name - b.name
                                    // })}
                                    columns={columns}
                                    key="aggregationTable"
                                    scroll={{ x: 1000 }} 
                                />
                            </>
                        )}
                </div>
            )
        }
    }
}
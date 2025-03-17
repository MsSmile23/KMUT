// import { useApi2 } from '@shared/hooks/useApi2'
// import { PieChartWrapper } from '@shared/ui/charts/highcharts/wrappers'
import { ItemsInARowWrapper } from '@shared/ui/wrappers/ItemsInARowWrapper/ItemsInARowWrapper'
import { FC, useEffect, useRef, useState } from 'react'
// import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import { IClass } from '@shared/types/classes'

import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { selectStates, useStatesStore } from '@shared/stores/states'
import { selectStateEntities, useStateEntitiesStore } from '@shared/stores/state-entities'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { IStates } from '@shared/types/states'
import { IStateEntities } from '@shared/types/state-entities'
import { Fragment } from 'react'
import { getStateViewParam } from '@shared/utils/states'
import { IObject } from '@shared/types/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { ILegendSettings } from '@shared/ui/charts/highcharts/wrappers/pie/PieChartWrapper'
import { ResponsivePieChart } from '@pages/dev/vladimir/ResponsivePieChartWrapper/ResponsivePieChart'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { ECTableWithProgressBar } from '@shared/ui/ECUIKit/tables/ECTableWithProgressBar'
import { useGetObjects } from '@shared/hooks/useGetObjects'

type IStatusTypes = 'class' | 'status'

export interface IStatusProps {
    representationType: 'pieChart' | 'progressBar'
    filters?: {
        type: IStatusTypes
        values: number[]
    }[]
    groupingType?: 'class'
    height?: number // высота контейнера, не графика
    isSingle?: boolean
    countInRow?: number
    legendSettings?: ILegendSettings
    pieSize?: number | string
    classesIds?: IClass['id'][] //Классы объекты которых надо отобразить
    childClsIds?: IClass['id'][] //Классы вспомогательные, которые отображать не надо
    parentObject?: IObject, //Родительский объект
}

interface IPieProps {
    data: {
        id: number
        count: number
        value: string
        icon?: IECIconView['icon']
        color?: string
    }[]
}

interface IPreparedData {
    id: number
    title?: string
    data: IPieProps['data']
    icon?: IECIconView['icon']
    color?: string
}
export const StatusWrapper: FC<IStatusProps> = ({ 
    representationType, filters, groupingType, height, isSingle, countInRow, legendSettings, pieSize, 
    parentObject, classesIds, childClsIds = []
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null)    
    const chartGap = 16
    /* const chartsInRowSelectOptions = [
        {
            value: 1,
            label: 1
        },
        {
            value: 2,
            label: 2
        },
        {
            value: 3,
            label: 3
        },
        {
            value: 4,
            label: 4
        },
        {
            value: 5,
            label: 5
        },
    ] */
    const [chartsInRow, /* setChartsInRow */] = useState(isSingle ? 1 : countInRow ??= 2)
    const [dimensions, setDimensions] = useState({
        // width: 0,
        // height: 0,
        width: wrapperRef.current?.clientWidth,
        height: wrapperRef.current?.clientHeight,
    }) 
    
    // console.log('dimensions', dimensions)
    const getDimensions = (dimensions: {
        width: number,
        height: number
    }) => {
        setDimensions(dimensions)
    }

    // console.log('dimensions', dimensions)
    /* const representationSelectOptions = [
        {
            value: 'pieChart',
            label: 'пайчарт'
        },
        {
            value: 'progressBar',
            label: 'прогресс-бар'
        },
    ] */
    const [representation, /*  setRepresentation */] = useState(representationType)

    
    /* const changeRepresentation = (value: IStatusProps['representationType']) => {
        setRepresentation(value)
    }
    const changeChartsInRow = (value: string) => {
        setChartsInRow(Number(value))
    } */
    const classes = useClassesStore(selectClasses)
    // const classes = useApi2<IClass[]>(() => getClasses({ all: true }), { state: [] })
    const objects = useGetObjects()
    const states = useStatesStore(selectStates) // справочник статусов
    const stateEntities = useStateEntitiesStore(selectStateEntities) // статусы объекто и атрибутов

    const oidsFilter = parentObject
        ? findChildObjectsWithPaths({
            childClassIds: childClsIds,
            targetClassIds: classesIds,
            currentObj: parentObject,
        }).objectsWithPath.map(item => item.id)
        : undefined

    const filteredObjects: IObject[] = objects.filter((obj) => {
        return  classesIds?.includes(obj.class_id) && 
            (oidsFilter === undefined || oidsFilter.includes(obj.id))
    })
    // console.log('oidsFilter', parentObject?.id, parentObject?.name, oidsFilter)
    // console.log('parentObject', parentObject?.id, parentObject?.name)

    useEffect(() => {
        if (stateEntities?.objects?.length > 0 && states?.length > 0) {
            setObjectStatuses(stateEntities.objects.filter(stateEnt => {
                return filteredObjects.findIndex(fo => fo.id === stateEnt.entity) > -1
            }))
            /* const newStates = states.reduce((acc, state) => {
                
            }, []) */

            setStatusValues(states)
        }
    }, [])

    const [statusValues, setStatusValues] = useState<IStates['object_states']>([])
    // console.log('statusValues', statusValues)
    const [objectStatuses, setObjectStatuses] = useState<IStateEntities['objects']>([])

    const preparedData = objectStatuses
        .reduce((acc, objectStatusItem, /* idx */) => {
            const { state, entity } = objectStatusItem
            const currObject = objects.find(obj => obj.id === entity)
            
            const class_id = currObject?.class?.id
            const currIcon = currObject?.class?.icon ?? 'CarOutlined'
            const currState = statusValues.find(stVal => stVal.id === state)
            const status_id = currState?.id
            
            let tempData: IStateEntities['objects'][number] | Record<string, any>
            let dataItem: IPreparedData
            const currClass = classes?.find(classItem => classItem.id === class_id)

            if (groupingType) {

                const existDataItem = acc.findIndex(item => item.id === class_id)

                if (existDataItem < 0) {
                    dataItem = {
                        id: class_id,
                        title: currClass?.name ?? 'Класс ' + class_id,
                        data: statusValues.map(stVal => ({
                            id: stVal.id,
                            value: stVal.view_params.name,
                            count: 0,
                            color: getStateViewParam(stVal, 'fill')
                        })),
                        // color: mockColors[idx],
                        icon: currIcon
                    }
                } else {
                    dataItem = acc[existDataItem]
                }
            } else {
                const existDataItem = acc.findIndex(item => item.id === 0)

                if (existDataItem < 0) {
                    dataItem = {
                        id: 0,
                        // title: 'Все объекты',
                        data: statusValues.map(stVal => ({
                            id: stVal.id,
                            // value: params.name,
                            value: stVal.view_params.name ?? `Серия ${stVal.id}`,
                            // value: stVal.name,
                            count: 0,
                            // color: params.fill
                            color: getStateViewParam(stVal, 'fill')
                        })),
                        // icon: params.icon as IInputIcon['icon']
                        icon: currIcon
                    }
                } else {
                    dataItem = acc[existDataItem]

                }
            }

            const statusDataIndx = dataItem['data'].findIndex(item => item.id === status_id)

            if (filters && filters.length > 0) {
                const conditions = filters
                    .map((filterItem) => {
                        switch (filterItem.type) {
                            case 'class': {
                                return filterItem.values.includes(class_id)
                            }
                            case 'status': {
                                return filterItem.values.includes(status_id)
                            }
                        }
                    })
                    .every((item) => item === true)

                tempData = conditions ? objectStatusItem : {}
                // tempData = conditions ? objectStatusItem : []
            } else {
                tempData = objectStatusItem
            }

            if (tempData) {
            // if (tempData.length > 0) {
                if (groupingType) {
                    dataItem.data[statusDataIndx].count++
                } else {
                    dataItem.data[statusDataIndx].count++
                }
            }

            const dataItemIndex = acc.findIndex(item => item.id === dataItem.id)

            if (dataItemIndex > -1) {
                acc[dataItemIndex] = {
                    ...acc[dataItemIndex],
                    data: [...dataItem.data]
                }
            } else {
                acc.push(dataItem)
            }

            return acc
        }, [] as IPreparedData[])
        // не отображать объекты с нулевым количеством по всем статусам
        .filter(item => item.data.some(subItem => subItem.count > 0))
        // убрать нулевые значения статусов, если какой-то из статусов не нулевой
        .map(item => ({
            id: item.id,
            title: item.title,
            data: item.data.filter(subItem => subItem.count > 0),
            icon: item.icon,
            color: item.color
        }))

    console.log('preparedData', parentObject?.id, parentObject?.name, preparedData)

    const pieGap = 5
    const renderRepresentation = () => {

        switch (representation) {
            case 'pieChart': {

                return (
                    <Fragment>
                        {preparedData.map((item, idx) => {
                            // todo исправить постОбработку состояний, заменить на этапе аккумуляции состояний
                            const newData = {
                                ...item,
                                data: item.data.reduce((acc, subItem) => {
                                    const idx = acc.findIndex(accItem => accItem.value === subItem.value)
                                
                                    if (idx > -1) {
                                        acc[idx].count += subItem.count
                                    } else {
                                        acc.push(subItem)
                                    }

                                    return acc
                                }, [])
                            }
                            
                            
                            return (
                                <ItemsInARowWrapper
                                    key={item.id}
                                    itemsGap={pieGap}
                                    // itemsGap={chartGap}
                                    itemsInRow={isSingle ? 1 : chartsInRow}
                                    getDimensions={getDimensions}
                                >
                                    <ResponsivePieChart
                                        data={newData.data}
                                        // data={item.data}
                                        title={newData.title}
                                        // title={item.title}
                                        icon={newData.icon}
                                        // icon={item.icon}
                                        color={newData.color}
                                        // color={item.color}
                                        height={(dimensions.height ?? 350) - pieGap * 2}
                                        width={(dimensions.width ?? 350) - pieGap * 2}
                                        // height={(height ?? 350) - pieGap * 2}
                                        // width={(width ?? 350) - pieGap * 2}
                                        legendSettings={legendSettings}
                                        pieSize={pieSize}
                                    />
                                    {/* <PieChartWrapper
                                        data={item.data}
                                        title={item.title}
                                        icon={item.icon}
                                        color={item.color}
                                        height={height ?? 350}
                                        legendSettings={legendSettings}
                                        pieSize={pieSize}
                                        dimensions={dimensions}
                                    /> */}
                                </ItemsInARowWrapper>
                            )
                        })}
                    </Fragment>

                )
            }
            case 'progressBar': {
                return (
                    <Fragment>
                        {preparedData.map((item) => {
                            return (
                                <Fragment key={item.id}>
                                    <ItemsInARowWrapper
                                        itemsGap={chartGap}
                                        itemsInRow={chartsInRow}
                                    >
                                        <ECTableWithProgressBar
                                            data={item.data}
                                            // height="400px"
                                        />
                                    </ItemsInARowWrapper>
                                </Fragment>
                            )
                        })}
                    </Fragment>

                )
            }
        }
    }

    return (
        <Fragment>
            {/* <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '5px',
                    padding: `0 ${chartGap}px`
                }}
            >
                <span style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Настройки</span>
                {!isSingle && (
                    <ECTooltip title="Количество в ряду">
                        <Select
                            style={{ width: 50 }}
                            placeholder="Количество в ряду"
                            defaultValue={String(chartsInRow)}
                            options={chartsInRowSelectOptions}
                            onChange={changeChartsInRow}
                        />
                    </ECTooltip>)}
                <ECTooltip title="Тип отображения">
                    <Select
                        style={{ width: 150 }}
                        placeholder="Тип отображения"
                        defaultValue={representation}
                        options={representationSelectOptions}
                        onChange={changeRepresentation}
                    />
                </ECTooltip>
            </div> */}
            <div
                ref={wrapperRef}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: chartGap,
                    // height: '100%',
                    height: height ?? 350
                }}
            >
                {renderRepresentation()}
            </div>
        </Fragment>
    )
}
import { IObject, IObjectAttribute } from '@shared/types/objects'
import { FC, memo, PropsWithChildren, useEffect, useState } from 'react'
import { IAttributeViewType } from '@shared/types/attributes'
import { IAttributeCategory } from '@shared/types/attribute-categories'
import { Select } from 'antd'
// eslint-disable-next-line max-len
import ObjectAttributeHistoryWrapper from '@entities/objects/ObjectAttributeHistoryWrapper/ObjectAttributeHistoryWrapper'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { useAttributeViewTypesStore } from '@shared/stores/attributeViewTypes'
import { selectAttrCategories, useAttributeCategoryStore2 } from '@shared/stores/attributeCategories'
import { ITargetObjectsAndOAttrsForm } from '@containers/widgets/WidgetObjectOAttrsWithHistory/TargetObjectsAndOAttrsForm'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { ItemsGrid } from '../../../shared/ui/wrappers/ItemsGrid/ItemsGrid'
import './ShowAnimation.scss'
import { OAttrHistoryView } from '@features/object-attributes/OAttrHistoryView/OAttrHistoryView'
import { IWidgetObjectOAttrsWithHistoryFormProps } from '@containers/widgets/WidgetObjectOAttrsWithHistory/ObjectOAttrsWithHistoryForm'
import { MiniChartContainer } from '@entities/attributes/MiniChartContainer/MiniChartContainer'
import ECPlatesColumnChartContainer from '@entities/object-attributes/ECPlatesColumnChartContainer/ECPlatesColumnChartContainer'
import { ECScatterPlotChart } from '@shared/ui/ECUIKit/charts/ECScatterPlotChart/ECScatterPlotChart'
import { TWidgetSettings } from '@containers/widgets/widget-types'

export type IAttr = {
    id: number
    oa: IObjectAttribute/*  | null */
    sort_order: number
    viewTypeId: IAttributeViewType['id'],
    viewType: IAttributeViewType['type'] | ''
}
interface IAttrsGroupByCategoryId {
    id: IAttributeCategory['id']
    category: IAttributeCategory['name'] | 'Без категории'
    ids: IAttr[]
    order?: number
}

const chartsInRowSelectOptions = [
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
]

interface IAttributeState {
    id: IAttributeCategory['id'],
    category: IAttributeCategory['name'] | 'Без категории',
    chartIds: IAttr[],
    tableIds: IAttr[],
    tracerouteAttrsIds: IAttr[],
    connectionMapAttrsIds: IAttr[],
    defaultAttrsIds: IAttr[],
    groupSortOrder?: number
}
interface ISortedDataItem {
    sort: number,
    ids: IAttr[],
    category: string
}

interface ISortedDataByViewType {
    chartIds: ISortedDataItem[],
    defaultAttrsIds: ISortedDataItem[],
    tableIds: ISortedDataItem[],
    tracerouteAttrsIds: ISortedDataItem[],
    connectionMapAttrsIds: ISortedDataItem[]
}

interface IComponentState {
    attrData: IAttributeState[],
    uncategorisedAttrs: IAttributeState,
    categorizedAttrs: IAttributeState[],
    attrDataSortedByOrderAndCategory: ISortedDataByViewType,
    currentObject: IObject,
    order: number,
    showAttrValue: string
}

function splitArray(array, groupSize) {
    const groups = [];

    for (let i = 0; i < array.length; i += groupSize) {
        groups.push(array.slice(i, i + groupSize));
    }
    
    return groups;
}

export interface IObjectOAttrsWithHistoryProps {
    object: IObject,
    asWidget?: boolean
    countInARow?: number
    limit?: number
    // countInARow?: 1|2|3|4|5
    historyDataType?: IWidgetObjectOAttrsWithHistoryFormProps['historyDataType']
    representationType?: IWidgetObjectOAttrsWithHistoryFormProps['representationType']
    attributeIds?: number[]
    attrCategoryIds?: number[]
    sortOrder?: 'byCategory' | 'byOwnSortOrderAndCategory'
    objectsWithAttrs?: ITargetObjectsAndOAttrsForm[]
    path?: string
    representationProps?: IWidgetObjectOAttrsWithHistoryFormProps['representationProps'],
    autoUpdate?: {
        enabled: boolean
        time?: number
    }
    vtemplateType?: TWidgetSettings['settings']['vtemplate']['builderData']
    builderView?: boolean
    skeletonItemCount?: number
    noAttributeTitle?: string
}

export const ObjectOAttrsWithHistory: FC<IObjectOAttrsWithHistoryProps> = memo(({
    object,
    asWidget,
    countInARow,
    limit,
    attrCategoryIds,
    attributeIds,
    historyDataType = 'history',
    // representationType = 'miniChart',
    representationType = 'default',
    // sortOrder = 'byCategory',
    sortOrder = 'byOwnSortOrderAndCategory',
    objectsWithAttrs,
    representationProps,
    path,
    autoUpdate,
    vtemplateType,
    builderView,
    skeletonItemCount,
    noAttributeTitle
}) => {
    const viewTypes = useAttributeViewTypesStore(st => st.store.data)
    const attributeCategories = useAttributeCategoryStore2(selectAttrCategories)
    const attributeStore = useAttributesStore(selectAttributes)
    const [chartsInRow, setChartsInRow] = useState(countInARow ?? 2)
    const [attributesData, setAttributesData] = useState<Record<string, IComponentState>>({})
    const [chosenAttrs, setChosenAttrs] = useState<IObjectAttribute[]>([])
    const getByIndex = useObjectsStore(selectObjectByIndex)
    const [isPrepared, setIsPrepared] = useState(false)
    const chartGap = '16px'

    useEffect(() => {
        setChartsInRow(countInARow ?? 2)
    }, [countInARow])

    const changeChartsInRow = (value: string) => {
        setChartsInRow(Number(value))
    }

    // const setPreparedValue = (value: boolean) => {
    //     if (objectsWithAttrs?.[0]?.objectId === 10433) {
    //         // console.log('setToFalse', value)
    //     }
    //     setIsPrepared(value)
    // }
    // console.log('historyDataType', historyDataType)
    // console.log('representationType', representationType)

    useEffect(() => {
        // !isPrepared && setPreparedValue(false)
        setIsPrepared(prev => false)
        const currentObjects = [
            objectsWithAttrs,
            asWidget,
            // objectsWithAttrs?.length > 0,
            // objectsWithAttrs?.[0]?.objectId
        ].every(Boolean)
            ? objectsWithAttrs.reduce((acc, item) => {
                if (item?.objectId) {
                    const itemObject = getByIndex('id', item.objectId)

                    const val = () => {
                        if (item?.showAttrValue) {
                            switch (typeof item?.showAttrValue) {
                                case 'number': {
                                    const attr = itemObject?.object_attributes
                                        ?.find(oa => oa.attribute_id === item.showAttrValue)

                                    return attr?.attribute_value
                                }
                                case 'string': {
                                    return itemObject?.[item?.showAttrValue]
                                }
                                default: {
                                    return ''
                                }
                            }
                        } else {
                            return ''
                        }
                    }

                    const attrValue = val()
    
                    acc.push({
                        obj: itemObject,
                        attrs: item.attributeIds && item.attributeIds?.length > 0
                            ? itemObject?.object_attributes?.filter(oa => item.attributeIds.includes(oa?.attribute?.id))
                            : itemObject?.object_attributes,
                        showAttrValue: attrValue ? `(${attrValue})` : ''
                    })
                }

                return acc
            }, [])
            : object
                ? [{
                    obj: object,
                    attrs: attributeIds && attributeIds.length > 0
                        ? object.object_attributes.filter(oa => attributeIds.includes(oa.attribute.id))
                        : object.object_attributes,
                }]
                : []
        
        // console.log('currentObjects', currentObjects)

        if (currentObjects.length > 0) {
            const result: IObjectAttribute[] = []

            currentObjects.forEach((item, idx) => prepareData({
                object: item.obj,
                attrs: item.attrs,
                showAttrValue: item.showAttrValue ?? '',
                idx,
                length: currentObjects.length,
                result
            }))

            result.sort((a, b) => a.id - b.id)

            setChosenAttrs(result)
        } else {
            setAttributesData(prev => ({}))
            // setPreparedValue(true)
            setIsPrepared(prev => true)
        }
    }, [
        object,
        attrCategoryIds,
        attributeIds,
        objectsWithAttrs,
        path
    ])

    const prepareData = async ({
        object, attrs, idx, length, showAttrValue, result
    }: {
        object: IObject
        attrs: IObjectAttribute[]
        showAttrValue: string
        idx: number
        length: number
        result: IObjectAttribute[]
    }) => {
        idx === 0 && setAttributesData({})
        const customAttributeCategory: IAttrsGroupByCategoryId[] = attributeCategories.map((item) => ({
            id: item.id,
            category: item.name,
            ids: [],
        }))

        customAttributeCategory.push({
            id: 0,
            category: 'Без категории',
            ids: [],
        })

        const chosenObjectAttributes = attrs
            // const chosenObjectAttributes = object.object_attributes
            ?.filter(oa => {
                const isHistoryToCacheAttribute = oa?.attribute?.history_to_cache || []
                const isHistoryAttribute = oa?.attribute?.history_to_db || []

                return isHistoryAttribute && isHistoryToCacheAttribute
            }) ?? []
        let idsFilter = ''

        chosenObjectAttributes?.map((oa, index) => {
            idsFilter += (index + 1) == chosenObjectAttributes.length ? `${oa.id}` :
                `${oa.id},`
        })

        //фильтруем атрибуты измерений для показа
        if (chosenObjectAttributes.length == 0) {
            return
        }
        const { data: filteredObjectAttributes } = await SERVICES_OBJECTS.Models.getObjectAttributes({
            all: true,
            ['filter[id]']: chosenObjectAttributes.map(oa => oa.id)
        })

        /* // для теста атрибута с отсутствующими измерениями
        const finalObjectAttributes = structuredClone(chosenObjectAttributes)  */
        const finalObjectAttributes = filteredObjectAttributes.reduce((acc, item) => {
            if (item.show) {
                acc.push({
                    ...item,
                    attribute: attributeStore.find(attr => attr.id == item.attribute_id)
                })
            }

            return acc
        }, [])

        finalObjectAttributes.forEach((OAttr) => {
            result.push({
                ...OAttr,
                showAttrValue
            })
        })
        // Старый вариант Эдуарда (не работает на ФНС)
        /* const currentChosenOAttrs = finalObjectAttributes
            .map((OAttr) => {
                OAttr['showAttrValue'] = showAttrValue

                return OAttr 
            })
            .sort((a, b) => a.id - b.id) */

        /* setChosenAttrs((prevChosenOAttrs) => {
            let currentChosenOAttrs = [...prevChosenOAttrs]

            finalObjectAttributes.forEach((OAttr) => {
                OAttr['showAttrValue'] = showAttrValue

                // if (currentChosenOAttrs.findIndex(chosenOAttr => chosenOAttr.id === OAttr.id) < 0) {
                if (!currentChosenOAttrs.find(chosenOAttr => chosenOAttr.id === OAttr.id)) {
                    return currentChosenOAttrs.push(OAttr)
                }
                const filteredState = currentChosenOAttrs.filter(currentOAttr => currentOAttr.id !== OAttr.id);

                filteredState.push(OAttr)

                return currentChosenOAttrs = filteredState.sort((a, b) => a.id - b.id);
            })

            // Старый вариант Владимира (не работает нигде кроме ФНС)
            // const currentChosenOAttrs = finalObjectAttributes
            //     .map((OAttr) => {
            //         OAttr['showAttrValue'] = showAttrValue

            //         return OAttr 
            //     })
            //     .sort((a, b) => a.id - b.id)
            
            return currentChosenOAttrs
        }) */

        // console.log('finalObjectAttributes', finalObjectAttributes)
        finalObjectAttributes?.map(oa => {
            // Объединение аттрибутов в группы по категориям аттрибутов 
            const catIndex = customAttributeCategory
                .findIndex(c => oa.attribute.attribute_category_id && c.id === oa.attribute.attribute_category_id)
            // Без категории
            const noCatIndex = customAttributeCategory.findIndex(c => c.id === 0)

            const currentIndex = catIndex > -1 ? catIndex : noCatIndex

            const currViewType: IAttributeViewType['type'] = viewTypes
                .find(vt => vt.id === oa.attribute.view_type_id)?.type

            if (catIndex > -1) {
                if (customAttributeCategory[currentIndex].order) {
                    if (customAttributeCategory[currentIndex].order < oa.attribute.sort_order) {
                        customAttributeCategory[currentIndex].order = oa.attribute.sort_order
                    }
                } else {
                    customAttributeCategory[currentIndex].order = oa.attribute.sort_order
                }
            }
            customAttributeCategory[currentIndex].ids
                .push({
                    id: oa?.id,
                    oa,
                    sort_order: oa?.attribute?.sort_order,
                    viewTypeId: oa.attribute.view_type_id,
                    viewType: currViewType
                })

            return
        })

        customAttributeCategory.map(cat => {
            cat.ids.sort((a, b) => {
                return a.sort_order - b.sort_order
            })

            return cat
        })

        const attrCatsWithData: IAttributeState[] = customAttributeCategory
            .filter(cat => {
                //todo Категории пока применяются для всех, а выбор стоит только для текущего объекта
                const isInCurrentCategories = attrCategoryIds && attrCategoryIds.length > 0
                    ? attrCategoryIds.includes(cat.id)
                    : true
                const isNotEmpty = cat.ids.length > 0

                return isInCurrentCategories && isNotEmpty
            })
            .map(cat => {
                const charts = cat.ids.filter(attrId => attrId.viewType === 'chart' || !attrId.viewType)
                const tables = cat.ids.filter(attrId => attrId.viewType === 'table')
                const traceroute = cat.ids.filter(attrId => attrId.viewType === 'traceroute')
                const connection_map = cat.ids.filter(attrId => attrId.viewType === 'connection_map')
                const defaultAttrs = cat.ids.filter(attrId => attrId.viewType === 'default')

                const sortByOrder = (arr) => {
                    const sameSortOrder = arr
                        .map(attr => attr.sort_order)
                        .every(val => val === arr[0].sort_order)

                    if (sameSortOrder) {
                        return arr
                    }

                    const newArr = arr.sort((a, b) => {
                        return a.sort_order - b.sort_order
                        // return a.sort_order === b.sort_order
                        //     ? a.id - b.id
                        //     : a.sort_order - b.sort_order
                    })

                    return newArr
                }

                return {
                    id: cat.id,
                    category: cat.category,
                    chartIds: sortByOrder(charts),
                    tableIds: sortByOrder(tables),
                    tracerouteAttrsIds: sortByOrder(traceroute),
                    connectionMapAttrsIds: sortByOrder(connection_map),
                    defaultAttrsIds: sortByOrder(defaultAttrs),
                    groupSortOrder: cat.order
                }
            })

        // eslint-disable-next-line max-len
        const attrDataSortedByOrderAndCategory: IComponentState['attrDataSortedByOrderAndCategory'] = attrCatsWithData.reduce((acc, item) => {

            const processItem = (type, ids, itemType, sortedByGroup) => {

                if (sortedByGroup && ids.length > 0) {
                    return acc[type].push({ sort: item.groupSortOrder, ids, category: item.category, type: itemType });
                }

                if (ids.length > 0) {
                    return ids.forEach(item => {
                        acc[type].push({
                            sort: item.sort_order,
                            ids: [item],
                            category: item.category,
                            type: item.viewType || 'chart'
                        })
                    });
                }
            };

            processItem('chartIds', item.chartIds, 'chart', item.groupSortOrder);
            processItem('tableIds', item.tableIds, 'table', item.groupSortOrder);
            processItem('tracerouteAttrsIds', item.tracerouteAttrsIds, 'traceroute', item.groupSortOrder);
            processItem('connectionMapAttrsIds', item.connectionMapAttrsIds, 'connection_map', item.groupSortOrder);
            processItem('defaultAttrsIds', item.defaultAttrsIds, 'chart', item.groupSortOrder);

            return acc;
        }, {
            chartIds: [],
            defaultAttrsIds: [],
            tableIds: [],
            tracerouteAttrsIds: [],
            connectionMapAttrsIds: []
        });

        setAttributesData(state => ({
            ...state,
            [object.id]: {
                attrData: attrCatsWithData,
                attrDataSortedByOrderAndCategory,
                currentObject: object,
                order: idx + 1,
                showAttrValue
            }
        }))
        // idx === length - 1 && setPreparedValue(true)
        idx === length - 1 && setIsPrepared(prev => true)
    }

    const defaultViewRender = () => {
        const allAttrs = Object.values(attributesData)
            .sort((a, b) => a.order - b.order)
            .reduce((acc, currentObjectData) => {
                const {
                    attrDataSortedByOrderAndCategory, currentObject,
                    showAttrValue, order
                } = currentObjectData
                const {
                    chartIds,
                    tableIds,
                    defaultAttrsIds,
                    tracerouteAttrsIds,
                    connectionMapAttrsIds
                } = attrDataSortedByOrderAndCategory

                const newArr = []
                    .concat(
                        chartIds,
                        tableIds,
                        defaultAttrsIds,
                        tracerouteAttrsIds,
                        connectionMapAttrsIds
                    )
                    .map(item => ({
                        ...item,
                        currentObject,
                        showAttrValue,
                        objectOrder: order
                    }))

                return acc.concat(newArr)
            }, [])

        return allAttrs
    }

    const advancedViewRender = () => {

        switch (representationType) {
            case 'miniChart': {
                // console.log('chosenAttrs', chosenAttrs)

                // только для historyDataType === 'history'
                return chosenAttrs.length > 0 
                    ? chosenAttrs.map(attr => (
                        <ItemsGrid
                            key={`miniChart ${attr.id}`}
                            gap={chartGap}
                            itemsInRow={chartsInRow}
                        >
                            <MiniChartContainer
                                hasLabels={true}
                                objectAttribute={attr}
                                miniChartProps={representationProps?.miniChart}
                                // height={representationProps?.miniChart?.height}
                                limit={limit}
                            />
                        </ItemsGrid>
                    ))
                    : (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {noAttributeTitle ?? 'Не выбрано ни одного измерения'}
                        </div>
                    )
            }
            case 'horizontalHistogram': {
                // только для historyDataType === 'current'
                if (chosenAttrs.length < 1) {
                    return (
                        <>Нет данных</>
                    )
                }

                return (
                    <ECPlatesColumnChartContainer 
                        oAttributes={chosenAttrs}
                        settings={representationProps.horizontalHistogram}
                        inverted={true}
                        fontSize={representationProps?.horizontalHistogram?.fontSize}
                    />
                )
            }
            case 'verticalHistogram': {

                if (chosenAttrs.length < 1) {
                    return (
                        <>Нет данных</>
                    )
                }

                const numberGroups = splitArray(chosenAttrs, 8);

                return numberGroups.map((groupChosenAttrs, index) => {
                    return (
                        <ECPlatesColumnChartContainer
                            key={'chosenOAttr' + index}
                            oAttributes={groupChosenAttrs} 
                            settings={representationProps?.verticalHistogram}
                            fontSize={representationProps?.verticalHistogram?.fontSize}
                        />
                    )
                });

            }
            case 'scatterPlot': {

                if (chosenAttrs.length < 1) {
                    return (
                        <>Нет данных</>
                    )
                }

                return (
                    <ECScatterPlotChart 
                        data={chosenAttrs}
                        limit={limit}
                        vtemplateType={vtemplateType}
                        builderView={builderView}
                    />
                )
            }
        }
    }

    // console.log('objectsWithAttrs', objectsWithAttrs)
    // console.log('attributesData', attributesData)
    
    return (
        <CustomSkeleton
            isPrepared={isPrepared}
            chartGap={chartGap}
            chartsInRow={chartsInRow}
            count={skeletonItemCount}
        >
            <NoDataWrapper
                isNotEmptyData={Object.values(attributesData).length > 0}
                title={noAttributeTitle}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        gap: 16,
                        padding: 16,
                    }}
                >
                    {!asWidget && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                padding: `0 ${chartGap} ${chartGap}`
                            }}
                        >
                            Выберите количество графиков в ряду
                            <Select
                                style={{ width: 50 }}
                                placeholder="Количество графиков в ряду"
                                defaultValue="2"
                                options={chartsInRowSelectOptions}
                                onChange={changeChartsInRow}
                            />
                        </div>
                    )}
                    {
                        representationType === 'default' 
                            ? defaultViewRender().map((currentAttrData, index) => {
                                return (
                                    <ItemsGrid
                                        gap={chartGap}
                                        itemsInRow={chartsInRow}
                                        key={'attr' + currentAttrData.ids.reduce((acc, a) => {
                                            return acc + a.id + ' - '
                                        }, '')}
                                    >
                                        <OAttrHistoryView 
                                            currentAttrData={currentAttrData} 
                                            index={index} 
                                            delay={Number(index + 1) * 200}
                                            limit={limit}
                                            autoUpdate={autoUpdate}
                                            vtemplateType={vtemplateType}
                                        /> 
                                    </ItemsGrid>
                                )
                            })
                            : advancedViewRender()
                    }
                </div>
            </NoDataWrapper>
        </CustomSkeleton>
    )

    /* return isPrepared
        ? Object.values(attributesData).length > 0
            ? (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        gap: 16,
                        padding: 16,
                    }}
                >
                    {!asWidget && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                padding: `0 ${chartGap} ${chartGap}`
                            }}
                        >
                            Выберите количество графиков в ряду
                            <Select
                                style={{ width: 50 }}
                                placeholder="Количество графиков в ряду"
                                defaultValue="2"
                                options={chartsInRowSelectOptions}
                                onChange={changeChartsInRow}
                            />
                        </div>
                    )}
                    {
                        representationType === 'default' 
                            ? defaultViewRender().map((currentAttrData, index) => {
                                return (
                                    <ItemsGrid
                                        gap={chartGap}
                                        itemsInRow={chartsInRow}
                                        key={'attr' + currentAttrData.ids.reduce((acc, a) => {
                                            return acc + a.id + ' - '
                                        }, '')}
                                    >
                                        <OAttrHistoryView 
                                            currentAttrData={currentAttrData} 
                                            index={index} 
                                            delay={Number(index + 1) * 200}
                                            limit={limit}
                                            autoUpdate={autoUpdate}
                                            vtemplateType={vtemplateType}
                                        /> 
                                    </ItemsGrid>
                                )
                            })
                            : advancedViewRender()
                    }
                </div>
            ) : (
                // При отсутствии прокинутого объекта
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '16px'
                    }}
                >
                    Выберите объект
                </div>
            )
        : (
            // Custom skeleton
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    gap: chartGap,
                    justifyContent: 'center',
                    alignContent: 'center',
                    opacity: 0.3
                }}
            >
                {[1, 2, 3, 4].map((skeleton) => {
                    return (
                        <ItemsGrid
                            gap={chartGap}
                            itemsInRow={chartsInRow}
                            key={'skeleton - ' + skeleton}
                        >
                            <ObjectAttributeHistoryWrapper
                                buttons={[]}
                                isSkeleton
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                        backgroundColor: '#ffffff'
                                    }}
                                >
                                    &nbsp;
                                </div>
                            </ObjectAttributeHistoryWrapper>
                        </ItemsGrid>
                    )
                })}
            </div>
        ) */

})

const CustomSkeleton: FC<PropsWithChildren<{ 
    isPrepared: boolean
    chartGap: string
    chartsInRow: number
    count?: number
}>> = ({ isPrepared, children, chartGap, chartsInRow, count = 4 }) => {

    if (isPrepared) {
        return children
    }

    const skeletonArray = Array.from('0'.repeat(count))

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
                gap: chartGap,
                justifyContent: 'center',
                alignContent: 'center',
                opacity: 0.3
            }}
        >
            {skeletonArray.map((skeleton, idx) => {
                return (
                    <ItemsGrid
                        gap={chartGap}
                        itemsInRow={chartsInRow}
                        key={'skeleton - ' + skeleton + ' - ' + idx}
                    >
                        <ObjectAttributeHistoryWrapper
                            buttons={[]}
                            isSkeleton
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    backgroundColor: '#ffffff'
                                }}
                            >
                                &nbsp;
                            </div>
                        </ObjectAttributeHistoryWrapper>
                    </ItemsGrid>
                )
            })}
        </div>
    )
}

const NoDataWrapper: FC<PropsWithChildren<{ 
    isNotEmptyData: boolean
    title?: string
}>> = ({ isNotEmptyData, children, title = 'Выберите объект' }) => {

    if (isNotEmptyData) {
        return children
    }

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '16px'
            }}
        >
            {title}
        </div>
    )
}
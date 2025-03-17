import { ItemsInARowWrapper } from '@shared/ui/wrappers/ItemsInARowWrapper/ItemsInARowWrapper'
import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { IClass } from '@shared/types/classes'

import { objectsStore, selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { Fragment } from 'react'
import { getStateViewParam } from '@shared/utils/states'
import { IObject } from '@shared/types/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { ILegendSettings, ResponsivePieChart } from '@pages/dev/vladimir/ResponsivePieChartWrapper/ResponsivePieChart'
import { selectStateStereotypes, useStateStereotypesStore } from '@shared/stores/statesStereotypes'
import { MLErrorBoundary } from '@shared/ui/MLErrorBoundary'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { useWindowResize } from '@shared/hooks/useWindowResize'
import Title from 'antd/es/typography/Title'
import { IStateEntities } from '@shared/types/state-entities'
import { ECTableWithProgressBar } from '@shared/ui/ECUIKit/tables/ECTableWithProgressBar'
import { TreeMapChartContainer } from '@entities/statuses/ObjectLinkedShares/TreeMapChartContainer'
import { TColor } from '@shared/types/common'
import StatePorts from '@entities/states/StatePorts/StatePorts'
import {
    IExtendedOAttribute,
    IPreparedData,
    IStatusTypes,
    countEntitiesByAttribute,
    countEntitiesByStates,
} from './utils'
import ColumnChartContainer from './ColumnChartContainer/ColumnChartContainer'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'
import { useGetObjects } from '@shared/hooks/useGetObjects'

export interface IStatusProps {
    representationType: 'pieChart' | 'progressBar' | 'treemap' | 'statePorts'
    filters?: {
        type: IStatusTypes
        values: number[]
    }[]
    groupingType?: 'class'
    groupingClass?: number
    height?: number // высота контейнера, не графика
    width?: number // ширина контейнера, не графика
    isSingle?: boolean
    isWidget?: boolean
    countInRow?: number
    legendSettings?: ILegendSettings
    pieSize?: number | string
    roundDigits?: number
    classesIds?: IClass['id'][] //Классы объекты которых надо отобразить
    childClsIds?: IClass['id'][] //Классы вспомогательные, которые отображать не надо
    parentObject?: IObject //Родительский объект
    dividingCriteria?: 'states' | 'attributes'
    title?: string
    entityType?: keyof IStateEntities
    objectAttributeIds?: number[]
    iconColor?: TColor
    rightFromTitleView?: 'absolute' | 'percent'
    rightFromProgressBarView?: 'absolute' | 'percent'
    precentType?: 'absolute' | 'calculated'
    valueDisplayType?: 'absolute' | 'percent' | 'combine'
    directionViewPorts?: 'horizontal' | 'vertical'
    dividingCriteriaProps?: {
        attribute_id: number
    }
    legendOffset?: number
    legendItemWidth?: number
    showPercents?: boolean
    showShortName?: boolean
    maxValue?: number
    linkedObjectsClasses?: number
    linkedObjects?: number[]
    showFilters?: boolean
    showObjectsTable?: boolean
}

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
]
const representationSelectOptions = [
    {
        value: 'pieChart',
        label: 'пайчарт'
    },
    {
        value: 'progressBar',
        label: 'прогресс-бар'
    },
] */

/* 
    Описание работы компонента
    На вход приходит объект (parentObject) и дальнейшее происходит с его дочерними объектами и атрибутами
    Отображение объектов и атрибутов задаётся настройкой entityType
    Если parentObject === undefined, то отображаются все объекты/атрибуты
    При помощи параметров можно classesIds и childClsIds можно назначить отображение объектов/атрибутов 
        выбранных целевых (classesIds) и связующих (childClsIds) классов
    При помощи параметра группировки groupingType можно назначить группировку отображения объектов/атрибутов по классам,
        и соответственно расположить несколько графиков в ряду (countInRow)
    Параметр legendSettings задает настройки легенды графика

*/
export const ObjectLinkedShares: FC<IStatusProps> = (props) => {
    const {
        representationType,
        filters,
        groupingType,
        width,
        isSingle,
        countInRow = 1,
        legendSettings,
        pieSize,
        parentObject,
        classesIds,
        childClsIds = [],
        isWidget,
        title,
        objectAttributeIds,
        entityType = 'objects',
        groupingClass,
        height,
        rightFromTitleView,
        rightFromProgressBarView,
        precentType,
        iconColor,
        valueDisplayType,
        directionViewPorts,
        dividingCriteria = 'states',
        dividingCriteriaProps,
        roundDigits,
        showShortName,
        linkedObjects,
        linkedObjectsClasses,
        showFilters,
        showObjectsTable,
    } = props
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
        : '#ffffff'
    const pieGap = 5
    const wrapperRef = useRef<HTMLDivElement>(null)
    const debug = false
    const [chartsInRow /* , setChartsInRow */] = useState(isSingle ? 1 : countInRow)
    const [dimensions, setDimensions] = useState({
        width: wrapperRef.current?.clientWidth,
        height: wrapperRef.current?.clientHeight,
    })
    const dataLayout = useLayoutSettingsStore((st) => st.dataLayout)
    const windowSizes = useWindowResize()
    const getByIndex = useObjectsStore(selectObjectByIndex)

    debug && console.log('width', width)
    debug && console.log('countInRow', countInRow)
    debug && console.log('dimensions', dimensions)
    debug && console.log('clientWidth', wrapperRef.current?.clientWidth)
    debug && console.log('clientHeight', wrapperRef.current?.clientHeight)

    /* 
        Колбэк для получения размеров контейнера для графика 
        Нужен, когда используется настройка отображения нескольких графиков в ряду
    */
    const getDimensions = (dimensions: { width: number; height: number }) => {
        debug && console.log('get dimensions', dimensions)
        setDimensions(dimensions)
    }

    /* 
        useLayoutEffect контролирует размеры контейнера при изменении размеров window, 
        а также настроек видимости левого и правого сайдбаров
    */
    useLayoutEffect(() => {
        const timeout = setTimeout(() => {
            if (countInRow === 1 && wrapperRef.current?.clientWidth !== 0 && wrapperRef.current?.clientHeight !== 0) {
                setDimensions({
                    width: wrapperRef.current?.clientWidth,
                    height: wrapperRef.current?.clientHeight,
                })
            }
        }, 100)

        return () => clearTimeout(timeout)
    }, [
        windowSizes.width,
        windowSizes.height,
        wrapperRef.current?.clientWidth,
        wrapperRef.current?.clientHeight,
        dataLayout.leftSidebar?.visibility,
        dataLayout.rightSidebar?.visibility,
        countInRow,
    ])

    /* const changeRepresentation = (value: IStatusProps['representationType']) => {
        setRepresentation(value)
    }
    const changeChartsInRow = (value: string) => {
        setChartsInRow(Number(value))
    } */

    const objects = useGetObjects()
    // const states = useStatesStore(selectStates) // справочник статусов
    const stateStereotypes = useStateStereotypesStore(selectStateStereotypes)

    /* 
        Если приходит объект сверху (из втемплейта или назначенный принудительно), то получаем его дочерние объекты
        по целевым (classesIds) и связующим классам (childClsIds). 
        Если целевые и связующие классы не назначены, то они берутся из конфига темы
    */
    const filterProps = showFilters
        ? {
            filter: {
                linkedObjects: [
                    {
                        classId: linkedObjectsClasses,
                        objectIds: linkedObjects,
                    },
                ],
            },
        }
        : {}
    const oidsFilter = parentObject
        ? findChildObjectsWithPaths({
            childClassIds: [],
            // childClassIds: childClsIds,
            allChildClassIds: true,
            targetClassIds: classesIds,
            currentObj: parentObject,
            ...filterProps,
        }).objectsWithPath.map((item) => item.id)
        : undefined

    // Пока никак не учитывается parentClass, если введен только он
    // В такой ситуации по сути нужно показывать все объекты данного класса,
    // Сейчас приходит в качестве parentObject vtemplate.id
    // const oldFilteredObjects: IObject[] = objects.filter(obj => {
    // // const filteredObjects: IObject[] = objects.reduce((acc, obj) => {
    //     /*
    //         Если приходит родительский объект, проверяем есть ли данный объект в списке дочерних родительского,
    //         либо назначаем сам родительский объект
    //         Если родительского объекта нет, то проверяем объект на наличие его в целевых классах (classesIds)
    //     */
    //     const condition = parentObject
    //         ? oidsFilter.length > 0
    //             ? oidsFilter.includes(obj.id)
    //             : obj.id === parentObject?.id
    //         : true
    //         // : classesIds?.includes(obj.class_id)

    //     return condition
    //     // return classesIds?.includes(obj.class_id) &&
    //     //     ((oidsFilter === undefined || oidsFilter.includes(obj.id)) ||
    //     //     (oidsFilter.length === 0 || obj.id === parentObject?.id ))
    // })

    // const filteredObjects = groupingClass
    //     ? oldFilteredObjects.reduce((acc, obj) => {
    //         if (obj.class_id === groupingClass) {
    //             const children = findChildObjectsWithPaths({
    //                 childClassIds: childClsIds,
    //                 targetClassIds: classesIds,
    //                 currentObj: obj,
    //             }).objectsWithPath

    //             console.log('children', obj.name, children)
    //             children.forEach(item => {
    //                 const newObj = getByIndex('id', item.id)

    //                 acc.push({
    //                     ...newObj,
    //                     class: {
    //                         ...newObj.class,
    //                         id: obj.id,
    //                         name: obj.name,
    //                         icon: obj.class.icon,
    //                     }
    //                 })
    //             })
    //         }

    //         return acc
    //     }, [] as IObject[])
    //     : oldFilteredObjects

    const filteredObjects: IObject[] = objects.reduce((acc, obj) => {
        let tempObjects: IObject[] = []

        if (parentObject) {
            const condition =
                oidsFilter.length > 0
                    ? oidsFilter.includes(obj.id)
                    : //: obj.id === parentObject?.id
                    false

            if (condition) {
                // acc.push(obj)
                // tempObj = [obj]
                tempObjects.push(obj)
            }
        } else {
            //     if (classesIds?.includes(obj.class_id)) {
            //         // acc.push(obj)
            //         // tempObj = [obj]
            //         tempObjects.push(obj)
            //     }
            if (groupingClass) {
                if (obj.class_id === groupingClass) {
                    tempObjects = []
                    const children = findChildObjectsWithPaths({
                        childClassIds: childClsIds,
                        targetClassIds: classesIds,
                        currentObj: obj,
                        filter: {
                            linkedObjects: [
                                {
                                    classId: linkedObjectsClasses,
                                    objectIds: linkedObjects,
                                },
                            ],
                        },
                    }).objectsWithPath

                    // console.log('children', obj.name, children)
                    children.forEach((item) => {
                        const newObj = getByIndex('id', item.id)

                        tempObjects.push({
                            ...newObj,
                            class: {
                                ...newObj.class,
                                id: obj.id,
                                name: obj.name,
                                icon: obj.class.icon,
                            },
                        })
                    })
                }
            } else {
                if (classesIds && classesIds.length > 0) {
                    if (classesIds.includes(obj.class_id)) {
                        tempObjects.push(obj)
                    }
                } else {
                    tempObjects.push(obj)
                }
            }
        }

        if (tempObjects.length > 0) {
            acc = acc.concat(tempObjects)
        }

        return acc
    }, [])

    debug && console.log('classesIds', classesIds)
    debug && console.log('childClsIds', childClsIds)

    debug && console.log('filters', filters)
    debug && console.log('oidsFilter', parentObject?.id, parentObject?.name, oidsFilter)
    debug && console.log('filteredObjects', filteredObjects)

    /* 
        Получаем измеряемые (history_to_cache, history_to_db) атрибуты отфильтрованных объектов
        И если приходит массив определенных атрибутов, то фильтруем по нему
        ПРоходим по атрибутам обогащая их данными класса объекта, к которому они привязаны
    */
    const filteredOAttrs: IExtendedOAttribute[] = filteredObjects.reduce((acc, obj) => {
        const attrs =
            objectAttributeIds && objectAttributeIds.length > 0
                ? obj.object_attributes.filter((oa) => objectAttributeIds.includes(oa.attribute_id))
                : obj.object_attributes

        attrs?.forEach((item) => {
            if (item?.attribute?.history_to_cache || item?.attribute?.history_to_db) {
                acc.push({
                    ...item,
                    class: {
                        id: obj.class_id,
                        name: obj.class.name,
                        icon: obj.class.icon,
                    },
                })
            }
        })

        return acc
    }, [])

    debug && console.log('objectAttributeIds', objectAttributeIds)
    debug && console.log('filteredOAttrs', filteredOAttrs)

    const defaultNoGroup = {
        id: 0,
        title: 'Без группировки',
        data: [],
    }

    /* 
        Создаем заготовку для сбора данных состояний объектов/атрибутов
    */
    const blankData: IPreparedData[] =
        stateStereotypes && stateStereotypes?.length > 0
            ? [
                {
                    ...defaultNoGroup,
                    data: stateStereotypes.map((st) => ({
                        id: st.id,
                        value: st.view_params.name,
                        count: 0,
                        color: getStateViewParam(st, 'fill'),
                    })),
                },
            ]
            : [
                {
                    ...defaultNoGroup,
                    // data: [
                    //     {
                    //         id: 0,
                    //         value: stateViewParamsDefault.name,
                    //         count: 0,
                    //         color: stateViewParamsDefault.fill
                    //     }
                    // ],
                },
            ]

    debug && console.log('blankData', blankData)
    // debug && console.log('states', states)

    const entitiesToShow = {
        objects: filteredObjects,
        object_attributes: filteredOAttrs,
    }

    const getPreparedData = () => {
        switch (dividingCriteria) {
            case 'states':
                return countEntitiesByStates({
                    data: entitiesToShow,
                    stateStereotypes,
                    groupingType,
                    entityType,
                    filters,
                    blankData,
                    linkedObjects,
                    linkedObjectsClasses,
                    showFilters,
                })
            case 'attributes':
                return countEntitiesByAttribute(filteredObjects, dividingCriteriaProps)
            default:
                return []
        }
    }

    const preparedData = useMemo(() => {
        return getPreparedData()
    }, [dividingCriteria, dividingCriteriaProps, filteredObjects, filteredOAttrs, groupingType, entityType, filters])

    // !parentObject?.id && debug && console.log('preparedData', preparedData)

    debug && console.log('preparedData', preparedData)

    const renderRepresentation = () => {
        if (representationType === 'pieChart') {
            return (
                <Fragment>
                    {preparedData.map((item) => {
                        // Если используется как виджет и не выбран параметр группировки,
                        // то отображается сам компонент графика, иначе в обёртке деления на блоки
                        return isWidget && !groupingType ? (
                            <ResponsivePieChart
                                key={item.id}
                                data={item.data}
                                title={showShortName ? item?.shortName ?? item.title : item.title}
                                icon={item.icon}
                                color={item.color}
                                height={(dimensions.height ?? 350) - pieGap * 2}
                                width={width - 10}
                                legendSettings={legendSettings}
                                pieSize={pieSize}
                                roundDigits={roundDigits}
                                showObjectsTable={showObjectsTable}
                                tableData={{ objects: filteredObjects, parentObjet: parentObject }}
                            />
                        ) : (
                            <ItemsInARowWrapper
                                key={item.id}
                                itemsGap={pieGap}
                                itemsInRow={isSingle ? 1 : isWidget ? countInRow : chartsInRow}
                                getDimensions={getDimensions}
                            >
                                <ResponsivePieChart
                                    key={item.id}
                                    data={item.data}
                                    title={showShortName ? item?.shortName ?? item.title : item.title}
                                    icon={item.icon}
                                    color={item.color}
                                    height={(dimensions.height ?? 350) - pieGap * 2}
                                    // width={(wrapperRef.current?.clientWidth ?? 350) - pieGap * 2}
                                    width={(dimensions.width ?? 350) - pieGap * 4}
                                    // height={(height ?? 350) - pieGap * 2}
                                    // width={(width ?? 350) - pieGap * 2}
                                    legendSettings={legendSettings}
                                    roundDigits={roundDigits}
                                    pieSize={pieSize}
                                    showObjectsTable={showObjectsTable}
                                    tableData={{ objects: filteredObjects, parentObjet: parentObject }}
                                />
                            </ItemsInARowWrapper>
                        )
                    })}
                </Fragment>
            )
        }

        if (representationType === 'treemap') {
            return (
                <Fragment>
                    {preparedData.map((item) => (
                        <ItemsInARowWrapper
                            key={item.id}
                            itemsGap={pieGap}
                            itemsInRow={isSingle ? 1 : isWidget ? countInRow : chartsInRow}
                            getDimensions={getDimensions}
                        >
                            <TreeMapChartContainer
                                key={item.id}
                                data={item.data}
                                color={item.color}
                                height={height}
                                width={width}
                                valueDisplayType={valueDisplayType}
                            />
                        </ItemsInARowWrapper>
                    ))}
                </Fragment>
            )
        }

        if (representationType === 'progressBar') {
            return (
                <Fragment>
                    {preparedData.map((item) => {
                        return (
                            <Fragment key={item.id}>
                                <ItemsInARowWrapper
                                    key={item.id}
                                    itemsGap={pieGap}
                                    itemsInRow={isSingle ? 1 : isWidget ? countInRow : chartsInRow}
                                    getDimensions={getDimensions}
                                >
                                    <ECTableWithProgressBar
                                        data={item.data}
                                        rightFromTitleView={rightFromTitleView}
                                        rightFromProgressBarView={rightFromProgressBarView}
                                        precentType={precentType}
                                        iconColor={iconColor}
                                        height={String(height)}
                                    />
                                </ItemsInARowWrapper>
                            </Fragment>
                        )
                    })}
                </Fragment>
            )
        }

        if (representationType === 'statePorts') {
            return <StatePorts objectIds={oidsFilter} directionView={directionViewPorts} />
        }

        if (representationType === 'verticalHistogram') {
            return (
                <Fragment>
                    {preparedData.map((item) => {
                        return (
                            <Fragment key={item.id}>
                                <ItemsInARowWrapper
                                    key={item.id}
                                    itemsGap={pieGap}
                                    itemsInRow={isSingle ? 1 : isWidget ? countInRow : chartsInRow}
                                    getDimensions={getDimensions}
                                >
                                    <ColumnChartContainer
                                        data={item.data}
                                        chartSettings={{
                                            height: props?.height,
                                            legendItemWidth: props?.legendItemWidth,
                                            legendOffset: props?.legendOffset,
                                            showPercents: props?.showPercents,
                                            maxValue: props?.maxValue,
                                            axisColor: textColor, // Цвет осей
                                            labelColor: textColor, // Цвет подписей
                                            backgroundColor: backgroundColor, // Задний фон диаграммы
                                        }}
                                    />
                                </ItemsInARowWrapper>
                            </Fragment>
                        )
                    })}
                </Fragment>
            )
        }

        return null
    }

    return (
        <Fragment>
            {/* <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '5px',
                    padding: `0 ${pieGap}px`
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
            <MLErrorBoundary message="Ошибка в работе виджета">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        // gap: pieGap,
                        cursor: 'pointer',
                        // height: '100%',
                        // height: height ?? 350,
                        // width: width ?? 'auto',
                        width: '100%',
                    }}
                >
                    {title && (
                        <Title
                            style={{
                                marginTop: '0px',
                                textAlign: 'center',
                                fontSize: 14,
                            }}
                            // level={5}
                        >
                            {title}
                        </Title>
                    )}
                    <div
                        ref={wrapperRef}
                        style={{
                            overflow: 'hidden',
                            overflowY: groupingType ? 'auto' : 'hidden',
                            display: 'flex',
                            justifyContent: countInRow === 1 ? 'center' : 'start',
                            // justifyContent: 'start',
                            // flexDirection: 'column',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: pieGap,
                            cursor: 'pointer',
                            // height: '100%',
                            // height: height ?? 350,
                            // width: width ?? 'auto',
                        }}
                    >
                        {renderRepresentation()}
                    </div>
                </div>
            </MLErrorBoundary>
        </Fragment>
    )
}
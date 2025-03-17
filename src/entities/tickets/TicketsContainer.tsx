import { ECTreeMapChart, ECWordCloudChart } from '@shared/ui/ECUIKit/charts'
import { ECTableWithProgressBar } from '@shared/ui/ECUIKit/tables/ECTableWithProgressBar'
import { FC, PropsWithChildren, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ILegendSettings, ITicketsContainerProps } from './types'
import { ResponsivePieChart } from '@pages/dev/vladimir/ResponsivePieChartWrapper/ResponsivePieChart'
import { useWindowResize } from '@shared/hooks/useWindowResize'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { getAttributeCountStrings } from '@shared/api/Stats/Models/getAttributeCountStrings'
import { useHealthStore } from '@shared/stores/health/healthStore'
import { Spin } from 'antd'
import { selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { findChildObjectsByBaseClasses, findParentsByBaseClasses } from '@shared/utils/objects'
import { getDayjsRange } from '@shared/utils/datetime'
import dayjs from 'dayjs'
import { getAttributeAggregation } from '@shared/api/Stats/Models/getAttributeAggregation'
import { SERVICES_STATES } from '@shared/api/States'
import { getFrequentFalls } from '@shared/api/Stats/Models/getFrequentFalls'
import { getDurationIncidents } from '@shared/api/Stats/Models/getDurationIncidents'
import { getAggregationIncidents } from '@shared/api/Stats/Models/getAggregationIncidents'
import BarChartContainer from '@entities/states/BarChartContainer/BarChartContainer'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'
import { useGetObjects } from '@shared/hooks/useGetObjects'

// const data = [
//     {
//         url: 'www.instagram.com/cringe',
//         count: 2
//     },
//     {
//         url: 'www.facebook.com',
//         count: 1
//     },
//     {
//         url: 'www.yandex.ru/test',
//         count: 2
//     },
//     {
//         url: 'stackoverflow.com/',
//         count: 1
//     },
//     {
//         url: 'www.google.com/test',
//         count: 1
//     },
//     {
//         url: 'www.youtube.com',
//         count: 1
//     }
// ];

const Wrapper: FC<PropsWithChildren<{ height?: ITicketsContainerProps['height'] }>> = ({ children }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}
    >
        {children}
    </div>
)

const TicketsContainer: FC<ITicketsContainerProps> = ({
    parentObjectId,
    representationType,
    height,
    width,
    rightFromTitleView,
    rightFromProgressBarView,
    precentType = 'absolute',
    valueDisplayType,
    viewProps,
    countInRow = 1,
    extract = 'none',
    attributeId, // = 10283,
    linkedObjectsForm,
    period = 'hour24',
    limit = 5,
    aggregation = 'sum',
    condition = '=0',
    dataType,
    time_units = 'hour', //TODO:: добавить в форму, см типизацию,
    showPercent,
    labelMargin,
    barBackgroundColor,
    barColor,
}) => {
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || '#000000'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || '#ffffff'
        : '#ffffff'

    const {
        targetClasses = [],
        connectingClasses,
        linksDirection = 'childs',
        chosenObjectsIds, // = [32972, 32976],
    } = linkedObjectsForm || {}

    const pieGap = 1
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    // const objectsStore = useObjectsStore(selectObjects)

    const objectsStore = useGetObjects()
    const isNetworkError = useHealthStore((st) => st.status === 'error')
    const wrapperRef = useRef<HTMLDivElement>(null)
    const { dataLayout } = useLayoutSettingsStore()
    const windowSizes = useWindowResize()

    const [data, setData] = useState<any>([])
    const [status, setStatus] = useState('idle')

    //Состояние для тултипа карты-дерева
    const [seriesTooltipTreemap, setSeriesTooltipTreemap] = useState<Highcharts.SeriesTreemapOptions['tooltip']>({
        pointFormat: '{point.name}<br />Количество: <b>{point.value} ({point.procent}%)</b>',
    })

    //Состояние для лэйблов карты-дерева
    const [seriesLabelsTreemap, setSeriesLabelsTreemap] = useState<Highcharts.SeriesTreemapOptions['dataLabels']>([
        {
            align: 'center',
            format: '{point.name}<br /> Количество: {point.value} ({point.procent}%)',
        },
    ])

    const [dimensions, setDimensions] = useState({
        width: wrapperRef.current?.clientWidth,
        height: wrapperRef.current?.clientHeight,
    })

    /* 
        Колбэк для получения размеров контейнера для графика 
        Нужен, когда используется настройка отображения нескольких графиков в ряду
    */
    const getDimensions = (dimensions: { width: number; height: number }) => {
        setDimensions(dimensions)
    }

    const legendSettings: ILegendSettings = {
        chart: {
            height: viewProps?.height || dimensions.height,
        },
        width: dimensions.width - 20,
        chartRatio: viewProps?.chartRatio,
        legendRatio: viewProps?.legendRatio,
        isEnabled: viewProps?.legendEnabled,
        units: '',
        typeValues: 'both',
        showNames: true,
        orientation: 'bottom',
        type: 'vertical',
    }

    /* 
        useLayoutEffect контролирует размеры контейнера при изменении размеров window, 
        а также настроек видимости левого и правого сайдбаров
    */
    useLayoutEffect(() => {
        const timeout = setTimeout(() => {
            if (countInRow === 1 && wrapperRef.current.clientWidth !== 0 && wrapperRef.current.clientHeight !== 0) {
                getDimensions({
                    width: wrapperRef.current?.clientWidth,
                    height: wrapperRef.current?.clientHeight,
                })
            }
        }, 100)

        return () => clearTimeout(timeout)
    }, [
        windowSizes.width,
        windowSizes.height,
        dataLayout.leftSidebar?.visibility,
        dataLayout.rightSidebar?.visibility,
        wrapperRef.current?.clientWidth,
        wrapperRef.current?.clientHeight,
        countInRow,
    ])

    const [object, setObject] = useState(getObjectByIndex('id', parentObjectId))

    useEffect(() => {
        setObject(prev => getObjectByIndex('id', parentObjectId))
    }, [parentObjectId])

    //Получаем родительский объект полностью
    // const object = getObjectByIndex('id', parentObjectId)

    //Получаем id связанных объектов
    const oidsFilter = useMemo(() => {
        if (targetClasses.length == 0) {
            return [object.id]
        } else {
            switch (true) {
                //Поиск родительских объектов
                case object && linksDirection == 'parents': {
                    return findParentsByBaseClasses({
                        object: object,
                        targetClasses: targetClasses,
                        linkedClasses: connectingClasses,
                        objects: objectsStore,
                    }).map((item) => item.id)
                }
                //Поиск дочерних объектов
                case object && linksDirection == 'childs': {
                    return findChildObjectsByBaseClasses({
                        childClassIds: connectingClasses,
                        targetClassIds: targetClasses,
                        currentObj: object,
                    })
                }
                default:
                    //return [object.id]
                    return undefined
            }
        }
    }, [object, connectingClasses, linksDirection, targetClasses])

    const objectIds = useMemo(() => {
        return chosenObjectsIds ?? oidsFilter
    }, [chosenObjectsIds, oidsFilter])

    const datePeriod = getDayjsRange(period)

    const payloadAttributeCountStrings = {
        attribute_id: attributeId,
        object_ids: objectIds,
        start: period ? String(dayjs(datePeriod[0]).unix()) : null,
        end: period ? String(dayjs(datePeriod[1]).unix()) : null,
        extract: extract,
        limit: limit,
    }

    const payloadAttributeAggregation = {
        attribute_id: attributeId,
        object_ids: objectIds,
        start: period ? String(dayjs(datePeriod[0]).unix()) : null,
        end: period ? String(dayjs(datePeriod[1]).unix()) : null,
        limit: limit,
        aggregation: aggregation,
        condition: condition,
        time_units: time_units,
    }

    const payloadGetFrequentFalls = {
        object_ids: objectIds,
        start: period ? String(dayjs(datePeriod[0]).unix()) : null,
        end: period ? String(dayjs(datePeriod[1]).unix()) : null,
        limit: limit,
    }

    const payloadGetDurationIncidents = {
        object_ids: objectIds,
        start: period ? String(dayjs(datePeriod[0]).unix()) : null,
        end: period ? String(dayjs(datePeriod[1]).unix()) : null,
    }
    const getAttributeCountStringsData = async () => {
        setStatus('loading')

        if (attributeId && oidsFilter?.length !== 0) {
            getAttributeCountStrings(payloadAttributeCountStrings).then((res) => {
                setData(res.data)
                setStatus('finished')
            })
        } else {
            setStatus('finished')
        }
    }

    const getAttributeAggregationData = async () => {
        setStatus('loading')

        if (attributeId && oidsFilter?.length !== 0) {
            getAttributeAggregation(payloadAttributeAggregation).then((res) => {
                setData(res.data)
                setStatus('finished')
            })
        } else {
            setStatus('finished')
        }
    }

    const getFrequentAllsData = async () => {
        setStatus('loading')

        if (oidsFilter?.length !== 0) {
            getFrequentFalls(payloadGetFrequentFalls).then((res) => {
                setData(res.data)
                setStatus('finished')
            })
        } else {
            setStatus('finished')
        }
    }

    const getDurationIncidentsData = async () => {
        setStatus('loading')

        if (oidsFilter?.length !== 0) {
            getDurationIncidents(payloadGetDurationIncidents).then((res) => {
                setData(res.data)
                setStatus('finished')
            })
        } else {
            setStatus('finished')
        }
    }

    const getAggregationIncidentsData = async () => {
        setStatus('loading')

        if (oidsFilter?.length !== 0) {
            getAggregationIncidents({ object_ids: objectIds }).then((res) => {
                setData(res.data)
                setStatus('finished')
            })
        } else {
            setStatus('finished')
        }
    }

    const getData = async (dataType: string) => {
        if (dataType === 'countStrings') {
            return getAttributeCountStringsData()
        }

        if (dataType === 'aggregation') {
            return getAttributeAggregationData()
        }

        if (dataType === 'frequent-falls') {
            return getFrequentAllsData()
        }

        if (dataType === 'duration-incidents') {
            return getDurationIncidentsData()
        }

        if (dataType === 'aggregation-incidents') {
            return getAggregationIncidentsData()
        }
    }

    useEffect(() => {
        if (isNetworkError || !dataType) {
            return
        }

        getData(dataType)
    }, [attributeId, objectIds, object, period, isNetworkError, dataType, condition])

    //Подготавливаем данные
    const preparedData = (data, keyMapping: { name: string; value: string }) => {
        const totalDataCount = data?.reduce((total, item) => total + item.value, 0)

        return data?.reduce((acc, item, i) => {
            const existItem = acc.find((obj) => obj[keyMapping.name] === item.name)

            if (existItem) {
                existItem[keyMapping.value] += Number(item.value.toFixed(2))
                existItem.percent = ((existItem[keyMapping.value] / totalDataCount) * 100).toFixed(1)
            } else {
                acc.push({
                    id: i + 1,
                    [keyMapping.name]: item.name,
                    [keyMapping.value]: Number(item.value.toFixed(2)),
                    percent: item?.percentage ?? Number((item.value / totalDataCount) * 100).toFixed(1),
                })
            }

            return acc
        }, [])
    }

    const dataForProgressBar = preparedData(data ?? [], { name: 'value', value: 'count' })?.sort(
        (a, b) => b.count - a.count
    )
    const dataForTreeMap = preparedData(data, { name: 'name', value: 'value' })

    useEffect(() => {
        if (valueDisplayType === 'absolute') {
            setSeriesLabelsTreemap([
                {
                    align: 'center',
                    format: '{point.name}<br /> Количество: {point.value}',
                },
            ])
            setSeriesTooltipTreemap({
                pointFormat: '{point.name}<br />Количество: <b>{point.value}</b>',
            })
        }

        if (valueDisplayType === 'percent') {
            setSeriesLabelsTreemap([
                {
                    align: 'center',
                    format: '{point.name}<br /> Количество: {point.percent}%',
                },
            ])
            setSeriesTooltipTreemap({
                pointFormat: '{point.name}<br />Количество: <b>{point.percent}%</b>',
            })
        }

        if (valueDisplayType === 'combine') {
            setSeriesLabelsTreemap([
                {
                    align: 'center',
                    format: '{point.name}<br /> Количество: {point.value} ({point.percent}%)',
                },
            ])
            setSeriesTooltipTreemap({
                pointFormat: '{point.name}<br />Количество: <b>{point.value} ({point.percent}%)</b>',
            })
        }
    }, [data, valueDisplayType])

    const representationComponent = () => {
        if (representationType === 'progressBar') {
            return (
                <ECTableWithProgressBar
                    data={dataForProgressBar}
                    rightFromTitleView={rightFromTitleView}
                    rightFromProgressBarView={rightFromProgressBarView}
                    precentType={precentType}
                    height={String(height)}
                    labelMargin={labelMargin}
                    barColor={barColor}
                    barBackgroundColor={barBackgroundColor}
                    textColor={textColor}
                />
            )
        }

        if (representationType === 'wordCloud') {
            return <ECWordCloudChart backgroundColor={backgroundColor} data={data} height={height} />
        }

        if (representationType === 'treemap') {
            return (
                <ECTreeMapChart
                    data={dataForTreeMap}
                    height={height}
                    width={width}
                    dataLabels={seriesLabelsTreemap}
                    tooltip={seriesTooltipTreemap}
                />
            )
        }

        if (representationType === 'pieChart') {
            return (
                <ResponsivePieChart
                    data={dataForProgressBar}
                    height={(dimensions.height ?? 350) - pieGap * 2}
                    width={dimensions.width ?? width - 10}
                    legendSettings={legendSettings}
                    pieSize={undefined}
                />
            )
        }

        if (representationType == 'horizontalBarChart') {
            return (
                <BarChartContainer
                    data={preparedData(data, { name: 'name', value: 'count' })}
                    chartSettings={{
                        height: height,
                        showPercents: showPercent,
                        textColor: textColor,
                        backgroundColor: backgroundColor,
                    }}
                />
            )
        }
    }

    const renderComponent = () => {
        switch (true) {
            case data?.length === 0 && status === 'finished': {
                return <Wrapper>Данные отсутствуют</Wrapper>
            }
            // case !data && status === 'finished': {
            //     return (
            //         <Wrapper>
            //             Неверный запрос
            //         </Wrapper>
            //     )
            // }
            case status === 'loading': {
                return (
                    <Wrapper>
                        <Spin />
                    </Wrapper>
                )
            }
            case data?.length !== 0 && status === 'finished': {
                return representationComponent()
            }
            default: {
                return (
                    <Wrapper>
                        <Spin />
                    </Wrapper>
                )
            }
        }
    }

    return (
        <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
            {renderComponent()}
        </div>
    )
}

export default TicketsContainer
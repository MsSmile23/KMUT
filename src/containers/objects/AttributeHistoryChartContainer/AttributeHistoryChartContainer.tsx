/* eslint-disable max-len */
import { SERVICES_ATTRIBUTE_HISTORY } from '@shared/api/AttributeHistory'
import { LineChart } from '@shared/ui/charts/highcharts/Charts'
import moment from 'moment'
import Highcharts, { SeriesLineOptions } from 'highcharts'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
// eslint-disable-next-line max-len
import ObjectAttributeHistoryWrapper from '@entities/objects/ObjectAttributeHistoryWrapper/ObjectAttributeHistoryWrapper'
import './AttributeHistoryChartContainer.css'
import { buttonsData } from '@entities/objects/ObjectAttributeHistoryWrapper/data'
import { OAButtonFullChart } from '@features/objects/OAButtonFullChart/OAButtonFullChart'
import { OAButtonInfo } from '@features/objects/OAButtonInfo/OAButtonInfo'
import {
    IAttr,
    IObjectOAttrsWithHistoryProps,
} from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { getPriorityState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { Button, Spin } from 'antd'
import { MLErrorBoundary } from '@shared/ui/MLErrorBoundary'
// import dayjs from 'dayjs'
import { ECTooltip } from '@shared/ui/tooltips'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { useInterval } from '@shared/hooks/useInterval'
import { exportData } from '@containers/objects/AttributeHistoryChartContainer/utils'
import { IIndicator, availableIndicatorsList } from '@pages/demo/show/DemoOAIndicators/utils'
import { IndicatorDropdown } from '@pages/demo/show/DemoOAIndicators/IndicatorDropdown'
import { useCheckOAStates } from '@shared/hooks/useCheckOAStates'
import { setLegendPosition } from '@shared/ui/ECUIKit/charts/utils'
import { WrapperRender } from './WrapperRender'
import { useTheme } from '@shared/hooks/useTheme'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

interface IMainSubRelations {
    mainId: number
    mainSerieName: string
    unit: string
    subSeries: {
        id: number | null
        unit: string
        data: Record<string, [number, number]>
        serName: string
    }[]
}
type TLoadingStatus = 'idle' | 'loading' | 'finished'

export const AttributeHistoryChartContainer: FC<{
    ids: IAttr[] // массив атрибутов объектов в категории
    category?: string
    customisation?: {
        nameSerieRender?: ({ oa_id, name }: { oa_id: number; name: string }) => string
    }
    singleChart?: boolean
    autoUpdate?: IObjectOAttrsWithHistoryProps['autoUpdate']
    vtemplateType?: IObjectOAttrsWithHistoryProps['vtemplateType']
    limit?: number
    changeAxisOrder?: boolean
    commonSettings?: {
        height?: number
        width?: number
        legendPosition?: 'top' | 'bottom' | 'left' | 'right'
        dateInterval?: [string, string]
    }
    background?: string
    color?: string
}> = ({
    ids,
    category,
    customisation = {
        nameSerieRender: ({ name }) => {
            return name
        },
    },
    singleChart = false,
    autoUpdate = {
        enabled: true,
        time: 600_000,
    },
    vtemplateType,
    limit,
    changeAxisOrder = false, // переключалка для перестановки осей при наличии order в массиве value_converter
    commonSettings,
    background,
    color,
}) => {
    const [chartData, setChartData] = useState<Highcharts.SeriesLineOptions[]>([])
    const seriesTitle = useRef<string>(null)

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const textColor = useMemo(() => {
        return isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    }, [theme?.widget, theme, themeMode])

    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const [isAutoUpdate, setIsAutoUpdate] = useState(autoUpdate.enabled)
    const [customOpts, setCustomOpts] = useState<Highcharts.Options>({
        chart: {
            backgroundColor: background ?? backgroundColor,
        },
        navigator: {
            margin: 0,
            xAxis: {
                labels: {
                    style: {
                        color: textColor,
                        textOutline: 'none',
                    },
                },
            },
        },
        legend: {
            margin: 0,
            itemStyle: {
                color: textColor,
            },
        },
        caption: {
            margin: 0,
        },
        credits: {
            enabled: false,
        },
        yAxis: {
            labels: {
                style: { color: textColor },
            },
        },
    })
    const [status, setStatus] = useState<TLoadingStatus>('idle')
    const units = useRef([])
    const initialDateIntervals: [string, string] = [null, null]
    const { oaStates } = useCheckOAStates({
        objectAttributeIds: ids.map((oa) => oa.id),
        currentObjectIds: [],
    })
    // const initialDateIntervals: [string, string] = [
    //     String(dayjs().subtract(48 * 60 * 60, 'second').unix()),
    //     String(dayjs().unix())
    // ]
    const [indicator, setIndicator] = useState<IIndicator | undefined>(undefined)
    const [singleSerie, setSingleSerie] = useState(false)
    const mainSubSeriesRelations = useRef<IMainSubRelations[]>([])
    const [dateIntervals, setDateIntervals] = useState<[string, string]>(
        commonSettings?.dateInterval ?? initialDateIntervals
    )

    useEffect(() => {
        setDateIntervals(commonSettings?.dateInterval ?? ['', ''])
    }, [commonSettings?.dateInterval])

    useEffect(() => {
        setCustomOpts((prev) => {
            return {
                ...prev,
                legend: {
                    ...prev.legend,
                    ...setLegendPosition(commonSettings?.legendPosition ?? 'bottom'),
                    width: ['bottom', 'top'].includes(commonSettings?.legendPosition ?? 'bottom') ? 200 : 100,
                    layout: ['bottom', 'top'].includes(commonSettings?.legendPosition ?? 'bottom')
                        ? 'horizontal'
                        : 'vertical',
                    maxHeight: 30,
                },
                navigator: {
                    ...prev.navigator,
                    xAxis: {
                        labels: {
                            style: {
                                color: textColor,
                                textOutline: 'none',
                            },
                        },
                    },
                },
            }
        })
    }, [
        // commonSettings?.height,
        // commonSettings?.width,
        commonSettings?.legendPosition,
        theme,
        themeMode,
    ])
    const getDateIntervals = (intervals: [string, string]) => {
        if (isAutoUpdate) {
            setIsAutoUpdate(false)
        }
        setDateIntervals(intervals)
    }

    const getChartData = async (ids: IAttr[]) => {
        setSingleSerie(false)
        const showTheseSeries: Highcharts.SeriesLineOptions[] = []
        let changeOpts: Highcharts.Options = {}
        let unit: string
        let mainSerieId: number
        let mainSerieName: string
        let mainMax: number
        let mainMin: number
        const limitPayload = limit ? { limit } : {}

        const dateIntervalsPayload =
            !dateIntervals?.[0] || !dateIntervals?.[1]
                ? {
                    ...limitPayload,
                }
                : {
                    start: dateIntervals?.[0],
                    end: dateIntervals?.[1],
                }

        if (vtemplateType === 'mockData') {
            setChartData([])
        } else {
            setStatus('loading')
            for (const attr of ids) {
                const response = await SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById({
                    id: attr.id,
                    ...dateIntervalsPayload,
                })

                if (response.success) {
                    if (response?.data !== undefined) {
                        seriesTitle.current = response?.data?.name ?? ''

                        response?.data?.series?.map((serie, serieIdx) => {
                            if (serie.params.view.type === 'chart') {
                                /* // Тестовый пример для изменения порядка осей
                                if ([72614, 72634].includes(attr.id)) {
                                    const newOrder = {
                                        0: 0,
                                        1: 6,
                                        2: 2,
                                        3: 4,
                                        4: 3,
                                        5: 5,
                                        6: 1
                                    }

                                    serie.params.view.value_converter = serie?.params?.view?.value_converter.map((item) => {
                                        return {
                                            ...item,
                                            order: newOrder[item.source]
                                        }
                                    })
                                } */

                                units.current.push({
                                    id: attr.id,
                                    unit: serie?.unit,
                                    serie: serie?.name,
                                })

                                const serName = response?.data?.series?.length > 1 ? serie?.name : response?.data?.name

                                if (attr.id === ids[0].id && serieIdx === 0) {
                                    unit = serie.unit
                                    mainSerieId = attr.id
                                    mainSerieName = serie?.name ?? response.data?.name
                                    ;(mainMax = serie?.params?.view?.value_converter
                                        ? serie?.params?.view?.value_converter.reduce((max, item) => {
                                            return Number(item.source) > max ? Number(item.source) : max
                                        }, 0)
                                        : serie?.params?.view?.max),
                                    (mainMin = serie?.params?.view?.min)
                                }

                                // Проверяем юнит каждой серии на соответствие заданному unit
                                // В зависимости от него кладём серию в главные или сабсерии
                                // главные отображаются линией на графике, сабсерии в тултипе
                                if (unit === serie?.unit) {
                                    unit = serie?.unit
                                    mainSerieId = attr.id
                                    mainSerieName = serie?.name ?? response?.data?.name

                                    const mainCurrentIdx = mainSubSeriesRelations.current.length

                                    mainSubSeriesRelations.current[mainCurrentIdx] = {
                                        mainId: mainSerieId,
                                        mainSerieName: mainSerieName,
                                        unit: unit,
                                        subSeries: [],
                                    }

                                    let fastValueConverter

                                    if (serie?.params?.view?.value_converter) {
                                        fastValueConverter = serie?.params?.view?.value_converter.reduce((acc, vc) => {
                                            if (!acc[vc.source]) {
                                                acc[vc.source] = vc.order ?? vc.source
                                            }

                                            return acc
                                        }, {})
                                    }
                                    const points = serie?.data
                                        .map((item) => {
                                            const msTimeStamp = item[0] * 1000
                                            // const converted = serie?.params?.view?.value_converter?.find(v => v.source == item[1])

                                            // const newValue = changeAxisOrder && converted
                                            const newValue =
                                                changeAxisOrder && fastValueConverter
                                                    ? fastValueConverter[item[1]]
                                                    : item[1]
                                            const point = [
                                                msTimeStamp,
                                                typeof newValue == 'string' ? parseFloat(newValue as string) : newValue,
                                            ]

                                            return point as [number, number]
                                        })
                                        .sort((a, b) => a[0] - b[0])

                                    showTheseSeries.push({
                                        type: 'line',
                                        id: `${attr.id}`,
                                        name: customisation.nameSerieRender({
                                            oa_id: attr.id,
                                            name: serie.name ?? response?.data?.name,
                                        }),
                                        data: points,
                                        connectNulls: true,
                                        custom: {
                                            params: {
                                                view: {
                                                    type: serie?.params?.view?.type,
                                                    max: serie?.params?.view?.max,
                                                    min: serie?.params?.view?.min,
                                                    value_converter: serie?.params?.view?.value_converter,
                                                },
                                                unit: serie?.unit ?? '',
                                                id: attr.id,
                                                serName: serName,
                                            },
                                        },
                                    })
                                } else {
                                    const mainCurrentIdx = mainSubSeriesRelations.current.length - 1

                                    const subCurrentIdx =
                                        mainSubSeriesRelations.current[mainCurrentIdx].subSeries.length

                                    mainSubSeriesRelations.current[mainCurrentIdx].subSeries[subCurrentIdx] = {
                                        id: attr.id,
                                        serName: serName,
                                        unit: serie?.unit ?? '',
                                        data: {},
                                    }

                                    serie?.data.map((item) => {
                                        const msTimeStamp = item[0] * 1000
                                        const point = [
                                            msTimeStamp,
                                            typeof item[1] == 'string' ? parseFloat(item[1] as string) : item[1],
                                        ]

                                        // Сохраняем каждую точку в ассоциативный массив сабсерии
                                        // eslint-disable-next-line max-len
                                        mainSubSeriesRelations.current[mainCurrentIdx].subSeries[subCurrentIdx]['data'][
                                            String(msTimeStamp)
                                        ] = point as [number, number]

                                        return point as [number, number]
                                    })
                                }

                                // Выставить лейблы оси у и мин/макс значения первой серии первого атрибута
                                changeOpts = {
                                    yAxis: [
                                        {
                                            labels: {
                                                style: {
                                                    color: color || textColor,
                                                },
                                                //@ts-ignore
                                                formatter: function() {
                                                    // если есть конвертер значений, то переименовать лейблы оси у
                                                    if (serie?.params?.view?.value_converter) {
                                                        return (
                                                            serie?.params?.view?.value_converter.find((item) => {
                                                                return changeAxisOrder && item?.order
                                                                    ? item.order === this.value
                                                                    : item.source == this.value
                                                            })?.converted ?? this.value
                                                        )
                                                    }

                                                    return `${this.value} ${unit ?? ''}`
                                                },
                                            },
                                            max: mainMax,
                                            min: mainMin ?? 0,
                                            tickInterval: serie?.params?.view?.value_converter ? 1 : undefined,
                                            title: {
                                                text: '',
                                            },
                                        },
                                    ],
                                }
                            }
                        })

                        setStatus('finished')
                    }
                }
            }

            // if (!dateIntervals[0] && !dateIntervals[1]) {
            //     if (showTheseSeries.length > 0) {
            //         const
            //     }
            // }

            if (showTheseSeries.length === 1) {
                setSingleSerie(true)

                if (indicator) {
                    showTheseSeries.push({
                        type: indicator?.code as SeriesLineOptions['type'],
                        linkedTo: showTheseSeries[0].id,
                        //@ts-ignore
                        params: {
                            period: 20,
                            standardDeviation: 2,
                        },
                    })
                }
            }

            setChartData(showTheseSeries)
        }

        /*
        const getTitle = () => {
            if (category && category !== 'Без категории') {
                return category
            } else {
                return undefined
            }
        }
        */
        const newOpts = {
            // title: {
            //     text: getTitle(),
            //     // text: `${getTitle() ?? seriesTitle}, ${unit}`,
            // },
            chart: {
                marginTop: 10,
                backgroundColor: background || backgroundColor || '#ffffff',
                // events: {
                //     render: function() {
                //         console.log('this', this)
                //     }
                // }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                    },
                },
            },
            legend: {
                margin: 0,
                itemStyle: {
                    color: color || textColor || '#000000',
                },
            },
            rangeSelector: {
                enabled: true,
                // selected: rangeButtons.findIndex(btn => btn.text === chartConfig.currentZoomInterval)
            },
            tooltip: {
                className: 'highcharts-tooltip-container',
                padding: 10,
                borderColor: '#000',
                backgroundColor: '#fff',
                borderWidth: 2,
                outside: false,
                // outside: true,
                shared: true,
                split: false,
                useHTML: true,
                distance: 20,
                formatter: function(this: { point; points; series }) {
                    // console.log('this tooltip', this)

                    const roundTo = (val: number, count = 2) => {
                        if (val - Math.floor(val) === 0) {
                            return val
                        }
                        const coef = Math.pow(10, count)

                        return Math.round(val * coef) / coef
                    }

                    const getDate = (time: number) => {
                        return moment.unix(time / 1000).format('HH:mm:ss DD-MM-YYYY')
                    }

                    const color = '#000000'
                    let newTooltip = `
                        <span style="color: ${color}; font-weight: bold; font-size: 1.2em">
                            ${getDate(this?.point.x)}
                        </span><br/>
                    `

                    // Если несколько серий
                    if (this.points) {
                        this.points.map((point) => {
                            const valueConverter = point?.series?.options?.custom?.params?.view?.value_converter

                            const currId = `${point?.series?.options?.custom?.params?.id}`

                            const convertedValueTooltip = valueConverter
                                ? // eslint-disable-next-line max-len
                                `[${currId}] ${point?.series?.name} - 
                                    ${valueConverter.find((item) => item.source == point?.y)?.converted}<br/>`
                                : ''
                            // eslint-disable-next-line max-len
                            const ordinalValueTtip = `[${currId}] ${point?.series?.name} - ${roundTo(point?.y)} ${
                                point?.series?.options?.custom?.params?.unit ?? ''
                            }<br/>`

                            // тултип главной серии
                            newTooltip +=
                                currId !== 'undefined'
                                    ? `
                                    <span style="color: ${point?.color}; font-weight: bold;">
                                        ${valueConverter ? convertedValueTooltip : ordinalValueTtip}
                                    </span>
                                `
                                    : ''

                            // проверка, есть ли у данной серии сабсерии
                            const currentMainSerie = mainSubSeriesRelations.current.find((item) => {
                                return (
                                    item.mainId === point?.series?.options?.custom?.params?.id &&
                                    item.mainSerieName === point?.series?.options?.custom?.params?.serName
                                )
                            })

                            // тултип всех сабсерий, если таковые имеются
                            // при скрытии серии в легенде, пропадают тултипы сабсерий, которые связаны с главной
                            if (currentMainSerie) {
                                currentMainSerie.subSeries.map((subSerie) => {
                                    newTooltip += `
                                        <span style="color: ${point?.color}; margin-left: 10px;">
                                            [${subSerie.id}] ${subSerie.serName} - 
                                                ${roundTo(subSerie.data[this?.point?.x][1])} ${subSerie.unit ?? ''}
                                        </span><br/>`
                                })
                            }
                        })
                    } else {
                        // Если только одна серия
                        const valueConverter = this?.point?.series?.options?.custom?.params?.view?.value_converter

                        // id серии для дебага
                        const currId = `${this?.series?.options?.custom?.params?.id}`

                        // с конвертацией
                        const convertedValueTooltip = valueConverter
                            ? `[${currId}] ${this?.series?.name} - 
                                ${valueConverter.find((item) => item.source == this?.point?.y).converted}}<br/>`
                            : ''

                        // без конвертации
                        const ordinalValueTtip = `[${currId}] ${this?.series?.name} - 
                            ${roundTo(this?.point?.y)} ${this?.series?.options?.custom?.params?.unit ?? ''}<br/>`

                        // тултип главной серии
                        newTooltip +=
                            currId !== 'undefined'
                                ? `
                                <span style="color: ${this.point?.color}; font-weight: bold;">
                                    ${valueConverter ? convertedValueTooltip : ordinalValueTtip}
                                </span>
                            `
                                : ''

                        // тултип всех сабсерий, если таковые имеются
                        // при скрытии серии в легенде, пропадают тултипы сабсерий, которые связаны с главной
                        const currentMainSerie = mainSubSeriesRelations.current.find((item) => {
                            return (
                                item.mainId === this.point?.series?.options?.custom?.params?.id &&
                                item.mainSerieName === this.point?.series?.options?.custom?.params?.serName
                            )
                        })

                        if (currentMainSerie) {
                            currentMainSerie.subSeries.map((subSerie) => {
                                newTooltip += `
                                    <span style="color: ${this.point?.color}; margin-left: 10px;">
                                        [${subSerie.id}] ${subSerie.serName} - 
                                            ${roundTo(subSerie.data[this?.point?.x][1])} ${subSerie.unit ?? ''}
                                    </span><br/>
                                `
                            })
                        }
                    }

                    return newTooltip
                    // return (
                    //     `<span
                    //         style='background-color: #ffffff; border: 1px solid #000000;
                    //             padding: 10px;'
                    //     >
                    //         ${newTooltip}
                    //     </span>`
                    // )
                },
            },
        } as Highcharts.Options

        setCustomOpts((prev) => {
            return {
                ...prev,
                ...Highcharts.merge(customOpts, changeOpts, newOpts),
            }
        })
    }

    useEffect(() => {
        let modifiedArray

        if (Array.isArray(customOpts?.yAxis)) {
            const yAxisLocal = [...customOpts.yAxis]

            modifiedArray = yAxisLocal.map((item) => ({
                ...item,
                lineColor: color || textColor,
                labels: {
                    ...item.labels,
                    style: { color: color || textColor },
                },
            }))
        }

        setCustomOpts((prev) => {
            return {
                ...prev,
                chart: {
                    ...prev.chart,
                    backgroundColor: background || backgroundColor,
                },
                legend: {
                    margin: 0,
                    itemStyle: {
                        color: color || textColor || '#000000',
                    },
                },
                yAxis: modifiedArray ?? prev.yAxis,
            }
        })
    }, [background, color])

    useInterval(
        () => {
            if (ids.length > 0) {
                // setTimeout(() => {
                getChartData(ids).then()
                // }, 0)
            }
        },
        autoUpdate && autoUpdate.enabled ? autoUpdate.time ?? 60_000 : null
    )

    useEffect(() => {
        if (ids.length > 0) {
            // setTimeout(() => {
            getChartData(ids).then()
            // }, 0)
        }
    }, [ids.length, dateIntervals?.[0], dateIntervals?.[1], indicator, limit])

    const nonNullDataChart =
        chartData?.filter?.((series) => {
            return series?.data?.length > 0
        }).length > 0

    const [openModalChart, setOpenModalChart] = useState(false)
    const [openModalInfo, setOpenModalInfo] = useState(false)
    const toggleModalChartIsVisible = () => {
        if (openModalChart && !isAutoUpdate) {
            setIsAutoUpdate(true)
        }
        setOpenModalChart(!openModalChart)
    }
    const toggleModalInfoIsVisible = () => {
        setOpenModalInfo(!openModalInfo)
    }

    const ifaces = useAccountStore((st) => st.store.data?.user?.role?.interfaces) ?? []
    const managerAvailable = ifaces?.includes('manager')
    // const managerAvailable = useAccountStore((st) => Boolean(st.store.data?.user?.role?.interfaces?.find((name) => {
    //     return name === 'manager'
    // })))
    const handleExportData = () => {
        exportData(chartData[0] || null)
    }

    const buttons = buttonsData
        .filter((btn) => btn.mnemo !== 'full_screen')
        .map((button) => {
            if (button.mnemo === 'export_data') {
                return {
                    ...button,
                    onClick: handleExportData,
                }
            }

            if (button.mnemo === 'full_chart') {
                return {
                    ...button,
                    onClick: toggleModalChartIsVisible,
                }
            }

            if (button.mnemo === 'info') {
                return {
                    ...button,
                    onClick: toggleModalInfoIsVisible,
                }
            }

            return button
        })
        .filter((btn) => (!managerAvailable ? btn.mnemo !== 'info' : true))

    const setCurrentIndicator = (value: string) => {
        const indicator = availableIndicatorsList.find((indicator) => indicator.value === value)

        setIndicator(indicator)
    }
    const renderChart =
        chartData.length === 0 && status === 'loading' ? (
            <WrapperRender height={commonSettings?.height}>
                <Spin style={{ color: 'red' }} />
            </WrapperRender>
        ) : nonNullDataChart ? (
            <LineChart
                seriesData={chartData}
                customOptions={customOpts}
                // defaultSettings={{
                //     periodMnemo: chartConfig.currentZoomInterval
                // }}
                commonSettings={commonSettings}
            />
        ) : // ) : (
            status === 'finished' ? (
                <WrapperRender height={commonSettings?.height}>Нет данных за период</WrapperRender>
            ) : (
                <WrapperRender height={commonSettings?.height}></WrapperRender>
            )

    const priorViewParams = useMemo(() => {
        const priorState = getPriorityState(
            'object_attributes',
            ids.map((itemId) => itemId.oa)
        )

        return getStateViewParamsWithDefault(priorState)
    }, [oaStates.map((state) => `${state.oaId}-${state.stateId}-${state.stereoId}`).join('.')])

    if (ids.findIndex((attr) => attr.id === 40144) > -1) {
        // console.log('priorState', priorState)
    }

    // для показа иконки полного графика, при нажатии выводится модалка с полным графиком
    if (singleChart) {
        const fullChartButton = buttonsData.find((button) => button.mnemo === 'full_chart')

        return (
            <MLErrorBoundary description="Ошибка в работе графика">
                <ECTooltip title={fullChartButton.label} placement="topLeft">
                    <Button size="small" shape="circle" onClick={toggleModalChartIsVisible}>
                        {fullChartButton.icon}
                    </Button>
                </ECTooltip>
                <OAButtonFullChart
                    open={openModalChart}
                    toggleModalChartIsVisible={toggleModalChartIsVisible}
                    getDateIntervals={getDateIntervals}
                    parentDateIntervals={dateIntervals ?? ['', '']}
                >
                    {renderChart}
                </OAButtonFullChart>
            </MLErrorBoundary>
        )
    }

    return (
        <MLErrorBoundary description="Ошибка в работе графика">
            <ObjectAttributeHistoryWrapper
                /* title={category === 'Без категории' 
                    ? seriesTitle.current 
                    : category} */
                title={category ? (category === 'Без категории' ? seriesTitle.current : category) : seriesTitle.current}
                buttons={buttons}
                stateParams={{
                    color: priorViewParams?.fill,
                    borderColor: priorViewParams?.border,
                    textColor: priorViewParams?.textColor,
                }}
                toolbarButtons={
                    singleSerie
                        ? [
                            <IndicatorDropdown
                                key="line_indicators"
                                getFormValues={(v) => setCurrentIndicator(v)}
                                currentIndicator={indicator?.value}
                            />,
                        ]
                        : []
                }
            >
                {renderChart}
                <OAButtonInfo attrIds={ids} open={openModalInfo} toggleModalInfoIsVisible={toggleModalInfoIsVisible} />
                <OAButtonFullChart
                    open={openModalChart}
                    toggleModalChartIsVisible={toggleModalChartIsVisible}
                    getDateIntervals={getDateIntervals}
                    parentDateIntervals={dateIntervals ?? ['', '']}
                >
                    {renderChart}
                </OAButtonFullChart>
            </ObjectAttributeHistoryWrapper>
        </MLErrorBoundary>
    )
}
/* eslint-disable react-hooks/exhaustive-deps */
import Highcharts from 'highcharts/highstock'
import { PieChart } from '@shared/ui/charts/highcharts/Charts'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { mockColors } from '@entities/statuses/ObjectLinkedShares/utils'
import { useTheme } from '@shared/hooks/useTheme'
import _ from 'lodash'
import { ECTooltip } from '@shared/ui/tooltips'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'
import { DefaultModal2 } from '@shared/ui/modals'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { IObject } from '@shared/types/objects'
import { StateLabel } from '@entities/states'
import { useStatesStore } from '@shared/stores/states'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useNavigate } from 'react-router-dom'

interface IPieProps {
    data: {
        id?: number
        count: number
        value: string
        icon?: IECIconView['icon']
        color?: string
    }[]
    title?: string
    icon?: IECIconView['icon']
    color?: string
    height?: number
    width?: number
    legendSettings?: ILegendSettings
    pieSize?: number | string
    roundDigits?: number
    showObjectsTable?: boolean
    tableData?: {
        objects?: IObject[]
        parentObjet?: IObject
    }
}
export interface ILegendSettings {
    units: string
    typeValues: 'both' | 'absolute' | 'percentage'
    isEnabled: boolean
    showNames: boolean
    showCategoryTitle?: boolean
    orientation: 'left' | 'right' | 'top' | 'bottom'
    type: 'callout' | 'horizontal' | 'vertical'
    width: number | string
    x?: number
    y?: number
    maxHeight?: number
    legendRatio?: number
    chartRatio?: number
    chart?: {
        height?: number
        width?: number
    }
    fontSize?: string
}

const OBJECTS_TABLE_COLUMNS = [
    {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
    },
    {
        key: 'name',
        title: 'Наименование',
        dataIndex: 'name',
    },
    {
        key: 'status',
        title: 'Статус',
        dataIndex: 'status',
    },
]
export const ResponsivePieChart: FC<IPieProps> = memo(
    ({
        data,
        title,
        icon,
        color,
        height,
        width,
        legendSettings,
        pieSize,
        roundDigits,
        showObjectsTable,
        tableData,
    }) => {
        const wrapperDimensions = useMemo(() => {
            return {
                height:
                    typeof legendSettings.chart.height === 'number'
                        ? legendSettings.chart.height
                        : parseInt(legendSettings.chart.height),
                width: typeof width === 'number' ? width : parseInt(width),
            }
        }, [legendSettings.chart.height, width])

        const navigate = useNavigate()

        const handleRowClick = (record) => {
            navigate(`/objects/show/${record.key}`)
        }
        const theme = useTheme()
        const accountData = useAccountStore(selectAccount)
        const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
        const interfaceView = generalStore((st) => st.interfaceView)
        const isShowcase = interfaceView === 'showcase'
        const textColor = isShowcase
            ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) ?? '#000000'
            : '#000000'
        const backgroundColor = isShowcase
            ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) ?? '#ffffff'
            : '#ffffff'
        //@ts-ignore
        const { pie } = theme.charts

        const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
        const [rows, setRows] = useState<any[]>([])

        const pieData = useMemo<Highcharts.SeriesPieOptions>(() => {
            return {
                type: 'pie',
                data: data.map((item) => ({
                    name: item.value,
                    y: item.count,
                    color: item?.color,
                    icon: item?.icon,
                })),
            }
        }, [data])

        const states = useStatesStore((st) => st.store.data)
        const stateEntities = useStateEntitiesStore((st) => st.store.data)

        useEffect(() => {
            if (tableData && showObjectsTable) {
                const localRows = []
                tableData.objects.forEach((item) => {
                    const stateId = stateEntities?.objects?.find((se) => se.entity === item.id)?.state
                    const state = states.find(({ id }) => id === stateId)

                    const title = state?.view_params?.name || 'Не определено'

                    localRows.push({
                        id: item.id,
                        key: item.id,
                        name: item.name,
                        status: (
                            <StateLabel
                                state={state}
                                stateId={stateId}
                                wrapperStyles={{ width: '100%', textAlign: 'center' }}
                                maxWidth
                            >
                                {title}
                            </StateLabel>
                        ),
                    })
                })

                setRows(localRows)
            }
        }, [tableData])
        const renderLegendParams = useMemo<Highcharts.LegendOptions>(() => {
            switch (legendSettings.orientation) {
                case 'left': {
                    return {
                        align: 'left',
                        verticalAlign: 'middle',
                    }
                }
                case 'right': {
                    return {
                        align: 'right',
                        verticalAlign: 'middle',
                    }
                }

                case 'top': {
                    return {
                        align: 'center',
                        verticalAlign: 'top',
                    }
                }
                case 'bottom': {
                    return {
                        align: 'center',
                        verticalAlign: 'bottom',
                    }
                }
                default: {
                    return {
                        align: 'left',
                        verticalAlign: 'middle',
                    }
                }
            }
        }, [legendSettings.orientation])
        const fullLabelCondition = useMemo(() => {
            return (
                legendSettings?.units?.length > 0 &&
                legendSettings?.typeValues === 'both' &&
                legendSettings?.showNames &&
                legendSettings?.type === 'callout'
            )
        }, [legendSettings?.units, legendSettings?.typeValues, legendSettings?.showNames, legendSettings?.type])

        const [options, setOptions] = useState<Highcharts.Options>({
            chart: {
                type: 'pie',
                margin: [0, 0, 0, 0],
                spacing: [0, 0, 0, 0],
                backgroundColor: backgroundColor,
                events: {
                    render: function (this: { series }) {
                        addTotalToDonutCenter(this)
                        addDoubleRing(this)
                        pie.donutType.enabled && addDoubleRing(this)
                    },
                },
                animation: false,
            },
            legend: {
                ...renderLegendParams,

                labelFormatter: function (this) {
                    return customLabels(this)
                },
                enabled: legendSettings.isEnabled && legendSettings.type !== 'callout',
                margin: legendSettings.isEnabled ? 20 : 0,
                itemStyle: {
                    color: textColor,
                },
                itemHoverStyle: {
                    color: textColor,
                },
            },
            tooltip: {
                outside: true,
                split: false,
                formatter: function (this: { percentage; point }) {
                    const isLast = this.point?.index === data.length - 1

                    return `${this?.point?.name}<br/>Количество: <b>${
                        isLast ? toDecimal(100 - toDecimal(100 - this?.percentage)) : toDecimal(this?.percentage)
                    }%</b>`
                },
            },
            plotOptions: {
                pie: {
                    animation: false,
                    innerSize: pie.donutType.enabled && pie.donutType.innerSize,
                    dataLabels: {
                        alignTo: 'plotEdges',
                        crop: false,
                        overflow: 'allow',
                        distance: 25,
                        position: 'right',
                        connectorShape: 'crookedLine',
                        crookDistance: undefined,
                        softConnector: false,
                        zIndex: -2,
                        verticalAlign: 'top',
                        connectorColor: pie.connectors.color,
                        connectorWidth: pie.connectors.width,
                    },
                    borderWidth: 0,
                    borderRadius: 0,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            event.preventDefault()
                        },
                    },
                    point: {
                        events: {
                            legendItemClick: function (event) {
                                event.browserEvent.stopPropagation()
                            },
                        },
                    },
                    showInLegend: true,
                    states: {
                        hover: {
                            enabled: true,
                            animation: {
                                duration: 0,
                            },
                        },
                        inactive: {
                            enabled: false,
                        },
                    },
                },
            },
        })

        const toDecimal = (value: number) => {
            const decimalValue = Math.pow(10, roundDigits ?? 1)
            return Math.round(value * decimalValue) / decimalValue
        }

        function addTotalToDonutCenter(chart) {
            const textColor = isShowcase
                ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || '#000000'
                : '#000000'

            if (['variablepie', 'pie'].includes(chart.options.chart.type)) {
                if (chart.customTitle) {
                    chart.customTitle.destroy()
                }

                if (chart?.series.length > 0) {
                    const series = chart.series[0]
                    const seriesCenter = series.center
                    const x = seriesCenter[0] + chart.plotLeft
                    const y = seriesCenter[1] + chart.plotTop
                    const text = '' + toDecimal(series.total)

                    chart.customTitle = chart?.renderer
                        ?.text(text, x, y, false)
                        .css({
                            fontSize: '1em',
                            color: !!textColor ? textColor : 'black',
                            fontWeight: 'bold',
                        })
                        .add()

                    const fontMetrics = chart.renderer.fontMetrics(chart.customTitle)
                    const customTitleSizes = chart.customTitle.getBBox()

                    chart.customTitle.attr({
                        x: x - customTitleSizes.width / 2,
                        y: y + fontMetrics.f / 2,
                        zIndex: 6,
                    })
                }
            }
        }

        // Добавление двойного кольца к бублику
        function addDoubleRing(chart) {
            const backgroundColor = isShowcase
                ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) ?? '#ffffff'
                : '#ffffff'
            if (chart.customCircles) {
                chart.customCircles.destroy()
                chart.customCircles = undefined
            }
            const ren = chart.renderer,
                centerX = chart.plotLeft + chart.plotSizeX / 2,
                centerY = chart.plotTop + chart.plotSizeY / 2,
                radius = [
                    chart?.series[0]?.data[0]?.shapeArgs?.r * pie.doubleRing.outerBorder.radiusCoef,
                    chart?.series[0]?.data[0]?.shapeArgs?.innerR * pie.doubleRing.innerBorder.radiusCoef,
                ]

            chart.customCircles = chart.renderer.g('customCircles').add()

            //Внешнее кольцо
            if (radius[0]) {
                ren.circle(centerX, centerY, radius[0])
                    .attr({
                        'fill': !!backgroundColor ? backgroundColor : pie.doubleRing.outerBorder.background,
                        'stroke': pie.doubleRing.innerBorder.color,
                        'stroke-width': pie.doubleRing.innerBorder.width,
                        'zIndex': 6,
                    })
                    .add(chart.customCircles)
            }

            //Внутреннее кольцо
            if (radius[1]) {
                ren.circle(centerX, centerY, radius[1])
                    .attr({
                        'fill': !!backgroundColor ? backgroundColor : pie.doubleRing.innerBorder.background,
                        'stroke': pie.doubleRing.innerBorder.color,
                        'stroke-width': pie.doubleRing.innerBorder.width,
                        'zIndex': 6,
                    })
                    .add(chart.customCircles)
            }
        }

        function customLabels(label) {
            // Если последний, то округлять относительно разницы с total
            // (так как при округлении точек возможна сумма больше 100%)
            const isLast = label.index === data.length - 1
            let lastPointBasedOnSumOfOtherPoints
            if (isLast) {
                lastPointBasedOnSumOfOtherPoints = label?.series?.data?.reduce((acc, item) => {
                    if (label?.id !== item?.id) {
                        acc = acc - toDecimal(item.percentage)
                    }

                    return toDecimal(acc)
                }, 100)
            }
            // настройка, чтобы не отображать пробел после значений, если единица измерения равна ""
            const unit = legendSettings.units && legendSettings.units.length > 0 ? ` ${legendSettings.units}` : ''
            // const unit = pieSettings.units && pieSettings.units.length > 0
            //     ? ` ${pieSettings.units}`
            //     : ''

            switch (legendSettings.typeValues) {
                // switch (pieSettings.typeValues) {
                case 'absolute': {
                    return legendSettings?.showNames
                        ? // return pieSettings.showNames
                          `${label.name} - ${toDecimal(label.y)}${unit}`
                        : // ? `<span /* style="font-size: 10px; */">${label.name} - ${toDecimal(label.y)}${unit}</span>`
                          `${toDecimal(label.y)}${unit}`
                }
                case 'percentage': {
                    return legendSettings?.showNames
                        ? // return pieSettings.showNames
                          `${label.name} - ${toDecimal(label.percentage)}%`
                        : `${isLast ? lastPointBasedOnSumOfOtherPoints : toDecimal(label.percentage)}%`
                }
                case 'both': {
                    return legendSettings?.showNames
                        ? // return pieSettings.showNames
                          `${label.name} - ${
                              isLast ? lastPointBasedOnSumOfOtherPoints : toDecimal(label.percentage)
                          }% (${toDecimal(label.y)}${unit})`
                        : `${isLast ? lastPointBasedOnSumOfOtherPoints : toDecimal(label.percentage)}% 
                    (${toDecimal(label.y)}${unit})`
                }
            }
        }

        const legendParams = useMemo(() => {
            const baseSize =
                wrapperDimensions.width / 2 > wrapperDimensions.height
                    ? wrapperDimensions.height * 0.8
                    : // ? wrapperDimensions.height - 50
                      wrapperDimensions.width * 0.4
            // : wrapperDimensions.width / 2 - 50

            if (['left', 'right'].includes(legendSettings?.orientation)) {
                const pieHeight = legendSettings?.chartRatio ? (legendSettings?.chartRatio * baseSize) / 100 : baseSize
                const legendHeightProportion = legendSettings.isEnabled ? 1 : 0
                const legendMaxHeight = legendSettings?.legendRatio
                    ? (legendSettings?.legendRatio * baseSize) / 100
                    : baseSize
                const xOffsetCoefficient = legendSettings?.orientation === 'right' ? 0.75 : 0.25
                const chartMarginTop = 0
                // const chartMarginTop = legendSettings?.showCategoryTitle
                //     ? 30
                //     : 0
                // const chartMarginBottom = -20
                const chartMarginRight =
                    legendSettings?.orientation === 'right'
                        ? wrapperDimensions?.width * 0.5
                        : // ? wrapperDimensions?.width * 0.5 + baseSize / 2
                          0
                const chartMarginLeft = legendSettings?.orientation === 'right' ? 0 : wrapperDimensions?.width * 0.5
                // : wrapperDimensions?.width * 0.5 + baseSize / 2
                const yOffsetCoefficient = wrapperDimensions.height / 2
                const chartXOffset =
                    legendSettings?.orientation === 'right' ? wrapperDimensions.width / 2 : -wrapperDimensions.width / 2

                const legendXOffset = legendSettings?.orientation === 'right' ? -10 : 10
                return {
                    legendHeightProportion,
                    pieHeight,
                    chartMarginBottom: 0,
                    chartMarginTop,
                    chartMarginRight,
                    chartMarginLeft,
                    legendMaxHeight,
                    legendXOffset,
                    legendYOffset: 0,
                }
            } else {
                const hwRelation = wrapperDimensions.height / wrapperDimensions.width
                // const mainDimension = hwRelation > 1 ? wrapperDimensions.height : wrapperDimensions.width
                // const subDimension = hwRelation > 1 ? wrapperDimensions.width : wrapperDimensions.height

                const pieHeightProportion =
                    legendSettings.chartRatio || legendSettings.chartRatio > 0
                        ? // может прийти либо в % (1-99), либо пропорция сразу
                          legendSettings.chartRatio < 1
                            ? legendSettings.chartRatio
                            : legendSettings.chartRatio / 100
                        : 0.3
                // const pieHeightProportion = 0.55

                const legendHeightProportion = legendSettings.isEnabled
                    ? legendSettings.legendRatio || legendSettings.legendRatio > 0
                        ? // может прийти либо в % (1-99), либо пропорция сразу
                          legendSettings.legendRatio < 1
                            ? legendSettings.legendRatio
                            : legendSettings.legendRatio / 100
                        : 0.55
                    : 0
                // const legendHeightProportion = 0.25

                const maxPieHeight = pieHeightProportion * wrapperDimensions.height
                const pieHeight =
                    hwRelation > 1
                        ? wrapperDimensions.width - 25 > wrapperDimensions.height * pieHeightProportion
                            ? wrapperDimensions.height * pieHeightProportion
                            : wrapperDimensions.width - 25
                        : wrapperDimensions.height * pieHeightProportion

                const chartMarginTop = 0
                // const chartMarginTop = legendSettings?.showCategoryTitle
                //     ? 30
                //     : 0
                const chartMarginBottom =
                    pieHeight === maxPieHeight
                        ? legendHeightProportion * wrapperDimensions.height
                        : wrapperDimensions.height - wrapperDimensions.width
                const legendMaxHeight =
                    pieHeight === maxPieHeight
                        ? legendHeightProportion * wrapperDimensions.height
                        : wrapperDimensions.height - wrapperDimensions.width - 25

                return {
                    legendHeightProportion,
                    pieHeight,
                    chartMarginBottom,
                    chartMarginTop,
                    chartMarginRight: 0,
                    chartMarginLeft: 0,
                    legendMaxHeight,
                    legendXOffset: 0,
                    legendYOffset: legendSettings?.orientation === 'bottom' ? -10 : 10,
                }
            }
        }, [
            legendSettings?.showCategoryTitle,
            legendSettings.chartRatio,
            legendSettings.legendRatio,
            legendSettings.isEnabled,
            legendSettings?.orientation,
            wrapperDimensions?.height,
            wrapperDimensions?.width,
        ])

        useEffect(() => {
            setOptions((prevOptions) =>
                Highcharts.merge(prevOptions, {
                    colors: mockColors, // будут отображаться, если в серию не переданы цвета
                    chart: {
                        backgroundColor: backgroundColor,
                        height: wrapperDimensions.height,
                        width: wrapperDimensions.width,
                        marginTop: legendParams?.chartMarginTop,
                        marginBottom: legendParams?.chartMarginBottom,
                        marginRight: legendParams?.chartMarginRight,
                        marginLeft: legendParams?.chartMarginLeft,
                        animation: false,
                        events: {
                            render: function (this: { series }) {
                                addTotalToDonutCenter(this)
                                addDoubleRing(this)
                                pie.donutType.enabled && addDoubleRing(this)
                            },
                            click: function (this: { series }) {
                                if (showObjectsTable) {
                                    setIsModalVisible(true)
                                }
                            },
                        },
                    },
                    title: {
                        style: {
                            display: 'block',
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: !!textColor ? textColor : color ?? '#000',
                        },
                        text: '',
                        margin: 0,
                    },
                    legend: {
                        ...renderLegendParams,
                        labelFormatter: function (this) {
                            return customLabels(this)
                        },
                        itemStyle: {
                            fontSize: legendSettings.fontSize,
                            color: !!textColor ? textColor : '#000000',
                        },
                        itemMarginBottom: 0,
                        itemMarginTop: 0,
                        enabled: legendSettings.isEnabled && legendSettings.type !== 'callout',

                        width: ['left', 'right'].includes(legendSettings?.orientation)
                            ? wrapperDimensions?.width / 2 - 20
                            : undefined,
                        margin: 0,
                        padding: 0,
                        maxHeight: legendParams?.legendMaxHeight,
                        layout: legendSettings.type === 'horizontal' ? 'horizontal' : 'vertical',
                        y: legendParams?.legendYOffset,
                    },
                    plotOptions: {
                        pie: {
                            size: legendParams?.pieHeight,
                            innerSize: pie.donutType.enabled && pie.donutType.innerSize,
                            dataLabels: {
                                alignTo: 'connectors',
                                enabled: legendSettings.isEnabled && legendSettings.type === 'callout',
                                formatter: function (this: { point }) {
                                    return customLabels(this.point)
                                },
                                connectorPadding: fullLabelCondition ? 0 : pie.connectors.padding,
                            },
                        },
                    },
                } as Highcharts.Options)
            )
        }, [
            title,
            icon,
            color,
            legendSettings?.isEnabled,
            legendSettings?.showNames,
            legendSettings?.type,
            legendSettings?.typeValues,
            legendSettings?.units,
            legendSettings?.x,
            legendSettings?.y,
            legendSettings?.fontSize,
            pieSize,
            wrapperDimensions.width,
            wrapperDimensions.height,
            backgroundColor,
            legendParams,
            renderLegendParams,
        ])

        return (
            <>
                {showObjectsTable && (
                    <DefaultModal2
                        title={`Просмотр объектов, связанных с ${tableData?.parentObjet?.name ?? ''}`}
                        open={isModalVisible}
                        onCancel={() => {
                            setIsModalVisible(false)
                        }}
                        destroyOnClose
                        footer={null}
                        width="70vw"
                    >
                        <EditTable
                            tableId="attributesList"
                            style={{ maxWidth: '100%' }}
                            columns={OBJECTS_TABLE_COLUMNS}
                            rows={rows}
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record), // Обработчик клика
                            })}
                        />
                    </DefaultModal2>
                )}
                <div
                    style={{
                        position: 'relative',
                    }}
                >
                    {icon && title && title !== 'Без группировки' && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: color,
                                width: width,
                                textAlign: 'center',
                                zIndex: 1000,
                            }}
                        >
                            {legendSettings?.showCategoryTitle && (
                                <span
                                    style={{
                                        width: '100%',
                                        fontWeight: 'bold',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <ECTooltip title={title}>{title}</ECTooltip>
                                </span>
                            )}
                        </div>
                    )}
                    <PieChart seriesData={pieData} customOptions={options} settings={theme} />
                </div>
            </>
        )
    },
    (prevProps, nextProps) => {
        return _.isEqual(prevProps, nextProps)
    }
)

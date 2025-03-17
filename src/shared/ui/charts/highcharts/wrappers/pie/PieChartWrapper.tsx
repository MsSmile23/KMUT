/* eslint-disable react-hooks/exhaustive-deps */
import Highcharts from 'highcharts/highstock'
import { PieChart } from '@shared/ui/charts/highcharts/Charts'
import { FC, useEffect, useState } from 'react'
// import { Popover,  Tooltip } from 'antd'
// import { SettingsForm } from './SettingForm'
import { IECIconView, /* InputIcon */ } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { mockColors } from '@entities/statuses/ObjectLinkedShares/utils'
import { useTheme } from '@shared/hooks/useTheme'

type ILegendAlign = (params: ILegendSettings['orientation']) => Highcharts.LegendOptions
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
    height?: number | string
    legendSettings?: ILegendSettings
    pieSize?: number | string
}
export interface ILegendSettings {
    units: string
    typeValues: 'both' | 'absolute' | 'percentage'
    isEnabled: boolean
    showNames: boolean
    orientation: 'left' | 'right' | 'top' | 'bottom'
    type: 'callout' | 'horizontal' | 'vertical'
    width: number | string
    x?: number
    y?: number
    maxHeight?: number
    chart?: {
        marginBottom?: number,
        size?: number
        height?: number
    }
    fontSize?: string
}
export const PieChartWrapper: FC<IPieProps> = ({
    data, title, icon, color, height, legendSettings, pieSize,
}) => {
    // console.log('data', data)
    const theme = useTheme()
    const { pie } = theme.charts
    
    const [pieData, setPieData] = useState<Highcharts.SeriesPieOptions>({
        type: 'pie',
    })
    const [/* titleCoords */, setTitleCoords] = useState({
        x: 0,
        y: 0
    })

    useEffect(() => {
        setPieData((state) => {
            return {
                ...state,
                data: data.map((item) => ({
                    name: item.value,
                    y: item.count,
                    color: item?.color,
                    icon: item?.icon
                })),
            }
        })
    }, [data])

    const [/* open */, /* setOpen */] = useState(false)
    /* const openSettingsForm = (value: boolean) => {
        setOpen(value)
    } */

    const renderLegendParams: ILegendAlign = (params) => {
        switch (params) {
            case 'left': {
                return {
                    align: 'left',
                    verticalAlign: 'middle'
                }
            }
            case 'right': {
                return {
                    align: 'right',
                    verticalAlign: 'middle'
                }
            }

            case 'top': {
                return {
                    align: 'center',
                    verticalAlign: 'top'
                }
            }
            case 'bottom': {
                return {
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
            default: {
                return {
                    align: 'left',
                    verticalAlign: 'middle'
                }
            }
        }
    }

    const [pieSettings, /* setPieSettings */] = useState<ILegendSettings>({
        units: legendSettings?.units ?? pie?.legend?.units ?? '',
        typeValues: legendSettings?.typeValues ?? pie?.legend?.typeValues ?? 'both',
        isEnabled: legendSettings?.isEnabled ?? pie?.legend?.isEnabled ?? true,
        showNames: legendSettings?.showNames ?? pie?.legend?.showNames ?? true,
        orientation: legendSettings?.orientation ?? pie?.legend?.orientation ?? 'bottom',
        type: legendSettings?.type ?? pie?.legend?.type ?? 'callout',
        width: legendSettings?.width ?? pie?.legend?.width ?? 200,
        x: legendSettings?.x,
        y: legendSettings?.y,
        maxHeight: legendSettings?.maxHeight,
        chart: {
            marginBottom: legendSettings?.chart?.marginBottom,
            size: legendSettings?.chart?.size,
            height: legendSettings?.chart?.height,
        },
        fontSize: legendSettings?.fontSize ?? '10px',
    })
    const fullLabelCondition =
        pieSettings.units && pieSettings.units.length > 0 &&
        pieSettings.typeValues === 'both' &&
        pieSettings.showNames &&
        pieSettings.type === 'callout'

    const [options, setOptions] = useState<Highcharts.Options>({
        chart: {
            type: 'pie',
            margin: [0, 5, 20, 5],
            events: {
                render: function(this: { series }) {
                    addTotalToDonutCenter(this)
                    pie.donutType.enabled && addDoubleRing(this)
                    getTitleCoords(this)
                },
                redraw: function(this) {
                    addTotalToDonutCenter(this)
                    addDoubleRing(this)
                    getTitleCoords(this)
                },
            },
            marginBottom: 20,

        },
        legend: {
            ...renderLegendParams(pieSettings.orientation),
            labelFormatter: function(this) {
                return customLabels(this)
            },
            enabled: pieSettings.isEnabled && pieSettings.type !== 'callout',
            // width: pieSettings.width ?? 'auto',
            margin: 20,
        },
        tooltip: {
            formatter: function(this: { percentage, point }) {
                return `${this?.point.name}<br/>Количество: <b>${toDecimal(this?.percentage)}%</b>`
            },
        },
        plotOptions: {
            pie: {
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
                    click: function(event) {
                        event.preventDefault()
                    }
                },
                showInLegend: true,
                states: {
                    hover: {
                        enabled: true,
                        animation: {
                            duration: 0
                        }
                    },
                    inactive: {
                        enabled: false
                    },
                }
            },
        },
    })

    /* const getPieSettings = (values: typeof pie.legend) => {
        setPieSettings(values)
    } */

    const toDecimal = (value: number) => Math.round(value * 10) / 10

    function getTitleCoords(chart) {
        const coords = chart?.title?.element?.getBBox()

        setTitleCoords({
            x: coords.x + coords.width + 3,
            y: coords.y - 4
        })
    }
    
    // console.log('titleCoords', titleCoords)

    function addTotalToDonutCenter(chart) {
        if (['variablepie', 'pie'].includes(chart.options.chart.type)) {
            if (chart.customTitle) {
                chart.customTitle.destroy()
            }

            if (chart?.series.length > 0) {
                
                const series = chart.series[0]
                const seriesCenter = series.center
                const x = seriesCenter[0] + chart.plotLeft
                const y = seriesCenter[1] + chart.plotTop
                const text = '' + series.total

                chart.customTitle = chart?.renderer?.text(
                    text,
                    x,
                    y,
                    false
                )
                    .css({
                        fontSize: '1em',
                        color: '#000000',
                        fontWeight: 'bold'
                    })
                    .add()

                const fontMetrics = chart.renderer.fontMetrics(chart.customTitle);
                const customTitleSizes = chart.customTitle.getBBox()

                chart.customTitle.attr({
                    x: x - customTitleSizes.width / 2,
                    y: y + fontMetrics.f / 2,
                    zIndex: 6,
                });
            }

        }
    }

    // Добавление двойного кольца к бублику
    function addDoubleRing(chart) {
        if (chart.customCircles) {
            chart.customCircles.destroy();
            chart.customCircles = undefined;
        }
        const ren = chart.renderer,
            centerX = chart.plotLeft + chart.plotSizeX / 2,
            centerY = chart.plotTop + chart.plotSizeY / 2,
            radius = [
                chart?.series[0]?.data[0]?.shapeArgs?.r * pie.doubleRing.outerBorder.radiusCoef,
                chart?.series[0]?.data[0]?.shapeArgs?.innerR * pie.doubleRing.innerBorder.radiusCoef
            ];

        chart.customCircles = chart.renderer.g('customCircles').add();

        //Внешнее кольцо
        if (radius[0]) {
            ren.circle(centerX, centerY, radius[0]).attr({
                fill: pie.doubleRing.outerBorder.background,
                stroke: pie.doubleRing.innerBorder.color,
                'stroke-width': pie.doubleRing.innerBorder.width,
                zIndex: 6
            }).add(chart.customCircles);
        }

        //Внутреннее кольцо
        if (radius[1]) {
            ren.circle(centerX, centerY, radius[1]).attr({
                fill: pie.doubleRing.innerBorder.background,
                stroke: pie.doubleRing.innerBorder.color,
                'stroke-width': pie.doubleRing.innerBorder.width,
                zIndex: 6
            }).add(chart.customCircles);
        }

    }

    function customLabels(label) {
        // настройка, чтобы не отображать пробел после значений, если единица измерения равна "" 
        const unit = pieSettings.units && pieSettings.units.length > 0
            ? ` ${pieSettings.units}`
            : ''

        switch (pieSettings.typeValues) {
            case 'absolute': {
                return pieSettings.showNames
                    ? `${label.name} - ${toDecimal(label.y)}${unit}`
                    // ? `<span /* style="font-size: 10px; */">${label.name} - ${toDecimal(label.y)}${unit}</span>`
                    : `${toDecimal(label.y)}${unit}`
            }
            case 'percentage': {
                return pieSettings.showNames
                    ? `${label.name} - ${toDecimal(label.percentage)}%`
                    : `${toDecimal(label.percentage)}%`
            }
            case 'both': {
                return pieSettings.showNames
                    ? `${label.name} - ${toDecimal(label.percentage)}% (${toDecimal(label.y)}${unit})`
                    : `${toDecimal(label.percentage)}% (${toDecimal(label.y)}${unit})`
            }
        }
    }

    // console.log('height', height)

    useEffect(() => {
        setOptions(Highcharts.merge(options, {
        // setOptions({
            // ...options,
            colors: mockColors, // будут отображаться, если в серию не переданы цвета 
            chart: {
                // ...options.chart,
                events: {
                    // ...options.chart.events,
                    render: function() {
                        addTotalToDonutCenter(this)
                        pie.donutType.enabled && addDoubleRing(this)
                        getTitleCoords(this)
                    }
                },
                height: pieSettings?.chart?.height ?? '100%',
                marginBottom: pieSettings.chart.marginBottom
            },
            title: {
                style: {
                    display: 'block',
                    fontSize: '12px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: color ?? '#000'
                },
                text: '',
                margin: 0,
            },
            legend: {
                ...renderLegendParams(pieSettings.orientation),
                labelFormatter: function(this) {
                    return customLabels(this)
                },
                itemStyle: {
                    fontSize: pieSettings.fontSize
                },
                itemMarginBottom: 0,
                itemMarginTop: 0,
                enabled: pieSettings.isEnabled && pieSettings.type !== 'callout',
                width: pieSettings.width ?? 'auto',
                margin: 0,
                // maxHeight: typeof height === 'string' ? parseFloat(height) * 0.3 : height * 0.3,
                maxHeight: pieSettings.maxHeight,
                layout: pieSettings.type === 'horizontal' ? 'horizontal' : 'vertical',
                x: pieSettings.x ?? 0,
            },
            plotOptions: {
                pie: {
                    size: pieSettings?.chart?.size ?? '100%',
                    /* size: typeof height === 'string' 
                        ? parseFloat(height) - pieSettings.maxHeight - 40
                        : height - pieSettings.maxHeight - 40,     */            
                    // size: pieSettings.type === 'callout' ? '50%' : '35%',
                    // size: pieSettings.type === 'callout' ? '50%' : null,
                    // size: pieSize ??= pieSettings.isEnabled ? '25%' : '50%',
                    // size: pieSettings.isEnabled ? '25%' : '50%',
                    // size: fullLabelCondition ? '25%' : '30%',
                    // center: [null, '20%'],
                    innerSize: pie.donutType.enabled && pie.donutType.innerSize,
                    dataLabels: {
                        alignTo: 'connectors',
                        enabled: pieSettings.isEnabled && pieSettings.type === 'callout',
                        formatter: function(this: { point }) {
                            return customLabels(this.point)
                        },
                        connectorPadding: fullLabelCondition
                            ? 0
                            : pie.connectors.padding,
                    },
                },
            },
        } as Highcharts.Options))
        // })
    }, [
        title,
        icon,
        color,
        height,
        legendSettings?.chart?.marginBottom,
        legendSettings?.chart?.size,
        legendSettings?.chart?.height,
        legendSettings?.isEnabled,
        legendSettings?.maxHeight,
        legendSettings?.orientation,
        legendSettings?.showNames,
        legendSettings?.type,
        legendSettings?.typeValues,
        legendSettings?.units,
        legendSettings?.width,
        legendSettings?.x,
        legendSettings?.y,
        legendSettings?.fontSize,
        pieSize
    ])

    return (
        <div
            style={{
                position: 'relative',
                // height: height
            }}
        >
            {/* {icon && title && title !== 'Без группировки' && ( */}
            {/* <div
                style={{
                    position: 'absolute',
                    top: 5,
                    // left: '45%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    width: 456,
                    textAlign: 'center',
                    // marginBottom: 10,
                    zIndex: 1000,
                }}
            > */}
            {/* <span 
                style={{ 
                    marginRight: 10, 
                    cursor: 'pointer', 
                }}
            >
                {icon && <InputIcon icon={icon} />}
            </span> */}
            {/* <span 
                style={{
                    width: '100%',
                    fontWeight: 'bold',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
            >
                <ECTooltip title={title}>
                    {title }
                </ECTooltip>
            </span> */}
            {/* </div> */}
            {/* )} */}
            {/* {title && (
                <div 
                    style={{
                        position: 'absolute',
                        top: titleCoords.y,
                        right: titleCoords.x,
                        zIndex: 100
                    }}
                >
                    <InputIcon icon={icon ?? 'AccountBookFilled'} />
                </div>
            )} */}
            {/* <div
                style={{
                    position: 'absolute',
                    // top: 35,
                    top: 3,
                    // top: title ? 35 : 10,
                    right: 5,
                    zIndex: 100
                }}
            >
                <ECTooltip title="Настройки пайчарта">
                    <Popover
                        open={open}
                        onOpenChange={openSettingsForm}
                        placement="bottomLeft"
                        trigger="click"
                        content={(
                            <SettingsForm
                                getPieSettings={getPieSettings}
                                values={pieSettings}
                            />
                        )}
                    >
                        <InputIcon icon="SettingOutlined" />
                    </Popover>
                </ECTooltip>
            </div> */}
            <PieChart
                seriesData={pieData}
                customOptions={options}
                settings={theme}
            />
        </div>
    )
}
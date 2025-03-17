import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { FC, useEffect, useRef, useState } from 'react'
import { Popover } from 'antd'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ISizes } from '../VladimirTest'
import { SettingsForm } from '@shared/ui/charts/highcharts/wrappers/pie/SettingForm'
import { pieStaticOptions } from '@shared/ui/charts/highcharts/highchartsOptions/static/pieStaticOptions'
import { useTheme } from '@shared/hooks/useTheme'

type IPositions = 'left' | 'right' | 'top' | 'bottom'
type ILegendAlign = (params: IPositions) => Highcharts.LegendOptions

interface ILegendSettings {
    units: string
    typeValues: 'both' | 'absolute' | 'percentage'
    isEnabled: boolean
    showNames: boolean
    orientation: 'left' | 'right' | 'top' | 'bottom'
    type: 'callout' | 'horizontal' | 'vertical'
    width: number | string
}

/* interface IPieProps {
    settings?: {
        legend?: ILegendSettings
        title?: string
        icon?: IInputIcon['icon']
        color?: string
        height?: number
        width?: number
    }
    points: {
        count: number
        value: string
        icon?: IInputIcon['icon']
        color?: string
    }[]
}  */
export const Pie: FC<{
    width: ISizes,
    height: ISizes,
    title?: string
}> = ({ width, height, title }) => {
    const theme = useTheme()
    const { pie } = theme.charts
    const chartRef = useRef<HighchartsReact.RefObject>(null)

    let customLabelFontSize: number,
        customTotalFontSize: number,
        customTitleFontSize: number,
        customLabelWidth: number

    if (parseFloat(width) < 350) {
        customLabelFontSize = 8
        customTotalFontSize = 12
        customTitleFontSize = 14
        customLabelWidth = 100
    } else if (parseFloat(width) < 450) {
        customLabelFontSize = 10
        customTotalFontSize = 16
        customTitleFontSize = 20
        customLabelWidth = 150

    } else {
        customLabelFontSize = 12
        customTotalFontSize = 13
        customTitleFontSize = 16
        customLabelWidth = 200

    }

    const [pieOptions, setPieOptions] = useState<Highcharts.Options>({
        accessibility: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        chart: {
            type: 'pie',
            plotBackgroundColor: undefined,
            plotBorderWidth: undefined,
            plotShadow: false,
            zooming: {
                type: 'x',
                mouseWheel: {
                    enabled: false
                }
            },
        },
        exporting: {
            enabled: false
        },
        title: {
            text: undefined
        },
        legend: {
            align: 'center',
            margin: 0,
            // floating: false,
            layout: 'vertical',
            verticalAlign: 'top',
            labelFormatter: function() {
                const name = this.name.length > 20 ? this.name.substr(0, 20) + '...' : this.name;

                //@ts-ignore
                return `${name}   ${this.y}%`
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        navigator: {
            enabled: false,
            outlineWidth: 0,
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        xAxis: {
            gridLineWidth: 0
        },
        series: [{
            type: 'pie',
            data: [{
                name: 'Chrome ChromeChrome',
                y: 61.41,
            }, {
                name: 'InternetExp Explorer',
                y: 11.84
            }, {
                name: 'Firefox',
                y: 10.85
            }, {
                name: 'Edge',
                y: 4.67
            }, {
                name: 'Safari',
                y: 4.18
            }, {
                name: 'Other',
                y: 7.05
            }]
        }]
    })
    const [openSettings, setOpenSettings] = useState(false)
    const [pieSettings, setPieSettings] = useState<ILegendSettings>({
        units: '',
        typeValues: 'both',
        isEnabled: true,
        showNames: true,
        orientation: 'bottom',
        type: 'callout',
        width: 200
    })

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
                const text = '' + toDecimal(series.total)

                chart.customTitle = chart?.renderer?.text(
                    text,
                    x,
                    y,
                    false
                )
                    .css({
                        fontSize: customTotalFontSize,
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


    useEffect(() => {
        setPieOptions({
            ...pieOptions,
            chart: {
                type: 'pie',
                margin: [0, 0, 0, 0],
                spacing: [0, 0, 0, 0],
                events: {
                    render: function(this) {
                        addTotalToDonutCenter(this)
                        pie.donutType.enabled && addDoubleRing(this)
                        // getTitleCoords(this)
                    },
                }
            },
            legend: {
                ...renderLegendParams(pieSettings.orientation),
                labelFormatter: function(this) {
                    return customLabels(this)
                },
                itemStyle: {
                    'fontSize': '14px'
                },
                floating: false,
                itemMarginBottom: 0,
                itemMarginTop: 0,
                enabled: pieSettings.isEnabled && pieSettings.type !== 'callout',
                width: pieSettings.width ?? 'auto',
                margin: 0,
                layout: pieSettings.type === 'horizontal' ? 'horizontal' : 'vertical',
            },
            title: {
                text: `<span style="font-size: ${customTitleFontSize}px">${title}</span>`,
            },
            tooltip: {
                formatter: function(this: { percentage, point }) {
                    return `${this?.point.name}<br/>Количество: <b>${toDecimal(this?.percentage)}%</b>`
                },
            },
            plotOptions: {
                pie: {
                    size: pieSettings.type === 'callout' ? `${parseFloat(width) * 0.35}px` : null,
                    innerSize: '50%',
                    dataLabels: {
                        // useHTML: true,
                        crop: false,
                        overflow: 'allow',
                        distance: 25,
                        position: 'right',
                        connectorShape: 'crookedLine',
                        // crookDistance: '99%',
                        crookDistance: undefined,
                        softConnector: false,
                        zIndex: -2,
                        verticalAlign: 'top',
                        connectorColor: 'grey',
                        connectorWidth: 1,
                        alignTo: 'plotEdges',
                        enabled: pieSettings.isEnabled && pieSettings.type === 'callout',
                        formatter: function(this: { point }) {
                            return customLabels(this.point)
                        },
                        connectorPadding: pieSettings.isEnabled
                            ? 0
                            : 10,
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
    }, [
        pieSettings.units,
        pieSettings.typeValues,
        pieSettings.isEnabled,
        pieSettings.showNames,
        pieSettings.orientation,
        pieSettings.type,
        pieSettings.width,
        width,
        title,
        height
    ])
    // useEffect(() => {
    //     if (chartRef.current) {
    //         chartRef.current.chart.setSize(parseFloat(width) - 30, parseFloat(height) - 30)
    //     }
    // }, [
    //     height, width    
    // ])
    const getPieSettings = (values: ILegendSettings) => {
        setPieSettings(values)
    }

    const toDecimal = (value: number) => Math.round(value * 10) / 10

    function customLabels(label) {
        // настройка, чтобы не отображать пробел после значений, если единица измерения равна "" 
        const unit = pieSettings.units && pieSettings.units.length > 0
            ? ` ${pieSettings.units}`
            : ''

        let customLabel: string
        
        switch (pieSettings.typeValues) {
            case 'absolute': {
                customLabel = pieSettings.showNames
                    ? `${label.name} - ${toDecimal(label.y)}${unit}`
                    : `${toDecimal(label.y)}${unit}`
                break
            }
            case 'percentage': {
                customLabel = pieSettings.showNames
                    ? `${label.name} - ${toDecimal(label.percentage)}%`
                    : `${toDecimal(label.percentage)}%`
                break
            }
            case 'both': {
                customLabel = pieSettings.showNames
                    ? `${label.name} - ${toDecimal(label.percentage)}% (${toDecimal(label.y)}${unit})`
                    : `${toDecimal(label.percentage)}% (${toDecimal(label.y)}${unit})`
                break
            }
        }

        return `
            <span 
                style="
                    font-size: ${customLabelFontSize};
                    maxWidth: ${customLabelWidth};
                    textOverflow: ellipsis;
                    whiteSpace: nowrap;
                    overflow: hidden;
                "
            >
                ${customLabel}
            </span>
        `
    }

    return (
        <div
            style={{
                position: 'relative',
                padding: 15,
                borderRadius: 16,
                boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.12)',
                width: width,
                height: height
            }}
        >        
            <div
                style={{
                    position: 'absolute',
                    bottom: 15,
                    left: 15,
                    zIndex: 999,
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: 'lightgrey',

                }}
            >
                width: {width} | height: {height}
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 15,
                    zIndex: 999,
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: 'lightgrey',

                }}
            >
                <div
                    style={{
                        backgroundColor: '#ccc',
                        cursor: 'pointer',
                        borderRadius: 5,

                    }}
                >
                    <ECTooltip title="Позиция">
                        <Popover
                            placement="bottomLeft"
                            open={openSettings}
                            onOpenChange={setOpenSettings}
                            trigger="click"
                            content={
                                <SettingsForm 
                                    getPieSettings={getPieSettings}
                                    values={pieSettings}
                                />
                            }
                        >
                            <ECIconView icon="RocketOutlined" />
                        </Popover>
                    </ECTooltip>
                </div>
            </div>
            <HighchartsReact 
                highcharts={Highcharts} 
                options={Highcharts.merge(pieStaticOptions, pieOptions)} 
                style={{ 
                    // maxWidth: '100%', 
                    // maxHeight: '100%',
                    maxWidth: `${parseFloat(width) - 30}px`, 
                    maxHeight: `${parseFloat(height) - 30}px`
                }} 
                ref={chartRef}
            />
        </div>
    )
}
/* eslint-disable max-len */
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
import { FC, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

export interface ICandlePoints {
    time: number
    in: number
    up: number
    down: number
}
interface ICandleChartProps {
    points: Record<string, ICandlePoints>,
    height: number
    setPeriodForModal: ({ start, end }) => void
    setOpenModal: (open: boolean) => void
    textColor?: string
    backgroundColor?: string
}

export const InOutChart: FC<ICandleChartProps> = ({ points, height, setPeriodForModal, setOpenModal, textColor, backgroundColor }) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null)

    const newPoints = Object.values(points)

    const extremum: {
        min: number
        max: number
    } = newPoints.reduce((acc, point, idx) => {
        const maxPoint = point.in + point.up
        const minPoint = maxPoint - point.down

        if (idx === 0) {
            acc['min'] = minPoint
            acc['max'] = maxPoint
        } else {
            minPoint < acc['min'] && (acc['min'] = minPoint)
            maxPoint > acc['max'] && (acc['max'] = maxPoint)
        }

        return acc
    }, {
        min: 0,
        max: 0
    })

    const buildSeries = () => {
        const series = newPoints.reduce((acc, point) => {
            const maxOpenedCoefficient = extremum.max < 1 ? 0.01 : extremum.max * 0.01
            const maxClosedCoefficient = extremum.max < 1 ? 0.01 : extremum.max * 0.01
            const openUp = point.up === 0 ? maxOpenedCoefficient : point.up
            const closeUp = point.down === 0 ? maxClosedCoefficient : point.down

            const custom = {
                in: point.in,
                up: point.up,
                down: point.down,
                time: point.time,
                maxOpened: maxOpenedCoefficient,
                maxClosed: maxClosedCoefficient,
            }

            acc.opened.push({
                x: point.time * 1000,
                open: point.in,
                high: point.in + openUp,
                low: point.in,
                close: point.in + openUp,
                y: point.in + openUp,
                custom,
            })
            acc.closed.push({
                x: point.time * 1000,
                open: point.in + openUp,
                high: point.in + openUp,
                low: point.in + openUp - closeUp,
                close: point.in + openUp - closeUp,
                y: point.in + openUp - closeUp,
                custom,
            })

            return acc
        }, {
            closed: [],
            opened: [],
        })

        return {
            opened: series?.opened?.sort((a, b) => a?.x - b?.x),
            closed: series?.closed?.sort((a, b) => a?.x - b?.x)
        }
    }

    const [options, setOptions] = useState<Highcharts.Options>({
        accessibility: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        chart: {
            reflow: true,
            type: 'candlestick',
            zooming: {
                type: 'x',
                mouseWheel: {
                    enabled: false
                }
            },
            animation: false,
            backgroundColor: backgroundColor || 'white'
        },
        navigator: {
            enabled: true,
            height: 20,
            handles: {
                symbols: ['navigator-handle', 'navigator-handle']
            },
            margin: 0,
            xAxis: {
                labels: {
                    style: {
                        color: textColor || 'black'
                    }
                }
            }
        },
        legend: {
            enabled: true,
            itemStyle: {
                color: textColor || 'black'
            },
            itemHoverStyle: {
                color: textColor || 'black'
            }
        },
        rangeSelector: {
            enabled: false
        },
        title: {
            useHTML: true,
            style: {
                fontWeight: 'bold',
            }
        },
        plotOptions: {
            candlestick: {
                lineWidth: 0,
                dataGrouping: {
                    enabled: false
                },
                states: {
                    hover: {
                        lineWidth: 0
                    },
                },
                point: {
                    events: {}
                }
            },
            series: {
                showInNavigator: true
            }
        },
        scrollbar: {
            enabled: false
        },
        series: [{
            type: 'candlestick',
            data: []
        },
        {
            type: 'candlestick',
            data: []
        }],
        xAxis: {
            labels: {
                rotation: -45,
                style: {
                    color: textColor || 'black'
                }
            },
            gridLineWidth: 1,
            gridLineDashStyle: 'LongDash',
            endOnTick: false
        },
        yAxis: {
            lineWidth: 0,
            title: {
                text: ''
            },
            opposite: false,
            tickInterval: extremum.max < 5
                ? 1
                : Math.ceil((extremum.max - extremum.min) / 5),
            showLastLabel: false,
            min: 0,
        },
    })

    const getExtraSpace = () => {
        if (newPoints.length > 0) {
            const range = newPoints[newPoints.length - 1].time - newPoints[newPoints.length - 2].time
            const extraSpace = (newPoints[newPoints.length - 1].time + range) * 1000

            return extraSpace
        }
    }

    useEffect(() => {
        const { opened, closed } = buildSeries()

        setOptions(state => ({
            ...state,
            series: [{
                pointPlacement: 0.7,
                color: closeColor,
                name: 'Закрытые',
                data: closed,
                type: 'candlestick',
                lineWidth: 0,
                turboThreshold: 10000
            },
            {
                pointPlacement: 0.3,
                upColor: openColor,
                color: openColor,
                name: 'Открытые',
                data: opened,
                type: 'candlestick',
                turboThreshold: 10000
            }],
            chart: {
                ...state.chart,
                backgroundColor: backgroundColor,
                height: height,
                events: {
                    ...state.chart.events,
                    render: function() {
                        return
                    }
                }
            },
            title: {
                ...state.title,
                text: '',
            },
            tooltip: {
                ...state.tooltip,
                split: false,
                shared: true,
                padding: 10,
                borderWidth: 1,
                backgroundColor: '#ffffff',
                shadow: false,
                borderColor: '#000000',
                outside: true,
                distance: 20,
                followPointer: true,
                formatter: function(this) {
                    const timeFormat = 'HH:mm'
                    const dateFormat = 'DD.MM.YYYY'
                    //@ts-ignore
                    const range = this.points[0]?.series?.basePointRange / 1000
                    const currentTime = dayjs(this.x).format(timeFormat)
                    const currentDate = dayjs(this.x).format(dateFormat)
                    const nextTime = dayjs(this.x).add(range, 'seconds').format(timeFormat)

                    const tsignore = ''
                    const closed = `
                        ${currentDate}<br/>
                        (с ${currentTime} до ${nextTime})<br/>
                        ${ /* @ts-ignore */ tsignore}
                        <span style="color: ${this.points[0].color.stops[1][1]};">
                            ${ /* @ts-ignore */ tsignore}
                            ${this.points[0].series.name}: ${this.points[0]?.point.custom.down}
                        </span><br/>
                    `
                    //@ts-ignore
                    const opened = `
                        ${ /* @ts-ignore */ tsignore}
                        <span style="color: ${this.points[1].color.stops[1][1]};">
                        ${ /* @ts-ignore */ tsignore}
                            ${this.points[1].series.name}: ${this.points[1]?.point.custom.up}
                        </span><br/>
                        <span style="color: '#000000';">
                            ${ /* @ts-ignore */ tsignore}
                            Всего: ${this.points[1]?.point.custom.in + this.points[1]?.point.custom.up - this.points[1]?.point.custom.down}
                        </span>
                    `

                    return `
                        <span 
                            style="
                                z-index: 100; 
                                background-color: #FFFFFF; 
                                padding: 5px; 
                                border: 1px solid #000000
                            "
                        >
                            ${closed}${opened}
                        </span>
                    `
                }
            },
            xAxis: {
                ...state.xAxis,
                type: 'datetime',
                max: getExtraSpace()
            },
            yAxis: {
                ...state.yAxis,
                tickInterval: extremum.max < 5 || extremum.max - extremum.min === 0
                    ? 1
                    : Math.ceil((extremum.max - extremum.min) / 5),
            },
            plotOptions: {
                ...state.plotOptions,
                candlestick: {
                    ...state.plotOptions.candlestick,
                    point: {
                        ...state.plotOptions.candlestick.point,
                        events: {
                            click: (event) => {
                                setPeriodForModal({
                                    start: opened[event.point.index]?.custom,
                                    end: opened[event.point.index + 2]?.custom
                                })
                                setOpenModal(true)
                            }
                        }
                    }
                }
            }
        }))

    }, [
        height,
        points,
        backgroundColor
    ])

    const openColor: Highcharts.GradientColorObject = {
        linearGradient: {
            x1: 0,
            x2: 0,
            y1: 1,
            y2: 0
        },
        stops: [
            [0, 'rgba(255, 255, 255, 1)'],
            [1, 'rgba(255, 89, 89, 1)'],
        ]
    }

    const closeColor: Highcharts.GradientColorObject = {
        linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
        },
        stops: [
            [0, 'rgba(255, 255, 255, 1)'],
            [1, 'rgba(144, 236, 125, 1)']
        ]
    }

    return (
        <HighchartsReact
            highcharts={Highcharts}
            constructorType="stockChart"
            options={options}
            ref={chartRef}
            containerProps={{
                style: {
                    width: '100%',
                }
            }}
        />
    )
}
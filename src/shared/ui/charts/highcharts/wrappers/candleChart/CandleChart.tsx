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
}

export const CandleChart: FC<ICandleChartProps> = ({ points, height }) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null)

    const newPoints = Object.values(points)
    
    const maxPoint = Math.max(...newPoints.map((point) => point.in + point.up))

    const [dataMaxPoint, setDataMaxPoint] = useState(maxPoint)
    const openedData: any[] = [],
        closedData: any[] = []

    const buildSeries = () => {
        newPoints.map((point) => {
            const maxOpenedCoef = dataMaxPoint < 1 ? 0.01 : dataMaxPoint * 0.01
            const maxClosedCoef = dataMaxPoint < 1 ? 0.01 : dataMaxPoint * 0.01
            const openUp = point.up === 0 ? maxOpenedCoef : point.up
            const closeUp = point.down === 0 ? maxClosedCoef : point.down

            openedData.push({
                x: point.time * 1000,
                open: point.in,
                high: point.in + openUp,
                low: point.in,
                close: point.in + openUp,
                y: point.in + openUp,
                custom: {
                    in: point.in,
                    up: point.up,
                    down: point.down,
                    time: point.time,
                    maxOpened: maxOpenedCoef,
                    maxClosed: maxClosedCoef,
                },
            })
            closedData.push({
                x: point.time * 1000,
                open: point.in + openUp,
                high: point.in + openUp,
                low: point.in + openUp - closeUp,
                close: point.in + openUp - closeUp,
                y: point.in + openUp - closeUp,
                custom: {
                    in: point.in,
                    up: point.up,
                    down: point.down,
                    time: point.time,
                    maxOpened: maxOpenedCoef,
                    maxClosed: maxClosedCoef,
                },
            })
        })
    }

    const getExtraSpace = () => {
        if (newPoints.length > 0) {
            const range = newPoints[newPoints.length - 1].time - newPoints[newPoints.length - 2].time
            const extraSpace = (newPoints[newPoints.length - 1].time + range) * 1000

            return extraSpace
        }
    }

    useEffect(() => {
        buildSeries()
        const chart = chartRef.current?.chart

        if (chart) {
            chart.update({
                series: [{
                    pointPlacement: 0.7,
                    color: closeColor,
                    name: 'Закрытые',
                    data: closedData.sort((a, b) => a.x - b.x),
                    type: 'candlestick',
                    lineWidth: 0,
                    turboThreshold: 10000
                },
                {
                    pointPlacement: 0.3,
                    upColor: openColor,
                    color: openColor,
                    name: 'Открытые',
                    data: openedData.sort((a, b) => a.x - b.x),
                    type: 'candlestick',
                    turboThreshold: 10000
                }],
                xAxis: {
                    type: 'datetime',
                    max: getExtraSpace()
                }
            })
        }
    }, [])

    useEffect(() => {
        buildSeries()
        const chart = chartRef.current?.chart

        if (chart) {
            chart.update({
                series: [{
                    pointPlacement: 0.7,
                    color: closeColor,
                    name: 'Закрытые',
                    data: closedData.sort((a, b) => a.x - b.x),
                    type: 'candlestick',
                    lineWidth: 0,
                    turboThreshold: 10000
                },
                {
                    pointPlacement: 0.3,
                    upColor: openColor,
                    color: openColor,
                    name: 'Открытые',
                    data: openedData.sort((a, b) => a.x - b.x),
                    type: 'candlestick',
                    turboThreshold: 10000
                }],
                chart: {
                    height: height,
                    events: {
                        render: function() {
                            return
                        }
                    }
                },
                title: {
                    text: '',
                },
                tooltip: {
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
                    type: 'datetime',
                    max: getExtraSpace()
                },
                yAxis: {
                    tickInterval: dataMaxPoint < 5 ? 1 : 5,
                }
            })
        }

    }, [
        dataMaxPoint,
        height,
        points
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
    };
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
    };



    const [options, /* setOptions */] = useState<Highcharts.Options>({
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
            }
        },
        navigator: {
            enabled: true,
            height: 20,
            handles: {
                symbols: ['navigator-handle', 'navigator-handle']
            },
        },
        legend: {
            enabled: true
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
            },
            gridLineWidth: 1,
            gridLineDashStyle: 'LongDash',
            endOnTick: false
        },
        yAxis: {
            events: {
                afterSetExtremes: function(event) {
                    setDataMaxPoint(event.dataMax)
                },
            },
            lineWidth: 0,
            title: {
                text: ''
            },
            opposite: false,
            // min: 0,
            tickInterval: dataMaxPoint < 5 ? 1 : 5,
            showLastLabel: false
        },
    })


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
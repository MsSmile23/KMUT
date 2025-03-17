/* eslint-disable @typescript-eslint/no-this-alias */
import Highcharts from 'highcharts';
import { IObject } from '@shared/types/objects';
import { getStateViewParamsFromEntity } from '@shared/utils/states';
import { initialArrType } from './data';
import more from 'highcharts/highcharts-more';
import draggable from 'highcharts/modules/draggable-points';

if (typeof Highcharts === 'object') {
    more(Highcharts);
    draggable(Highcharts);
}

const getChartOptions = ({
    setObjForModalId,
    setIsModalVisible,
}): Highcharts.Options => ({
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 0,
    },
    title: {
        text: '',
    },
    subtitle: {
        text: ''
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: false,
            },
            keys: ['from', 'to'],
        },
        series: {
            point: {
                events: {
                    click: function(e: any) {
                        setObjForModalId(e.point.id)
                        setIsModalVisible(true)
                    },
                },
            },
        }
    },
    series: [{
        type: 'networkgraph',
        draggable: false,
        dataLabels: {
            enabled: true,
        },
        nodes: [],
        data: [],
    }]
})


const getCabelsColors = (cables?: IObject[]) => {
    if (cables) {
        return cables.reduce((ids, cable) => ({
            ...ids,
            [cable.id]: getStateViewParamsFromEntity(cable?.id, 'objects')?.fill ?? 'grey'
        }), {})
    }

    return {
        10064: '#cccccc',
        10066: '#b87333'
    }
}

export const NetworkMapUtils = {
    getChartOptions,
    getCabelsColors
}

function formatTooltip(tooltip, point = this.point, series = this.series) {
    return series?.nodes
        ?.filter((node) =>
            point?.plotX == node?.plotX && point?.plotY == node?.plotY)
        ?.map((item) => `<span style="font-size: 10px; color:${item.color}">${item?.name}</span></br>`)
}

export const createChartOptions = ({
    onClick,
    onContextMenu,
    onMouseOver,
    onMouseOut,
    nodes,
    backgroundColorMap,
    windowDimensions,
    textSize,
    textColor,
    switchStatus,
    data,
    role,
    initialDataMap
}: {
    onClick: (arg: any, allNodes: any[], type: 'link' | 'point') => void
    onContextMenu: (arg: any, point: any) => void
    onMouseOver: (lines: any, coord: Record<'x'| 'y', number>) => void,
    onMouseOut: () => void,
    nodes: Highcharts.SeriesNetworkgraphNodesOptions[],
    backgroundColorMap: string
    windowDimensions: {width: number, height: number}
    textSize: number
    textColor: string
    switchStatus: boolean
    data: Highcharts.SeriesNetworkgraphOptions['data'][]
    role: string,
    initialDataMap: initialArrType[]
}) => {

    const getColor = (el) => {
        const group = el.series?.nodes.filter((node) =>
            el.point?.plotX == node?.plotX && el.point?.plotY == node?.plotY).map((item) => item.id)

        const isGroup = group.length > 1 && group.includes(el.point.id)

        if (switchStatus) {
            return isGroup ? 'black' : el.point.color
        } else if (textColor) {
            return textColor
        }

        return isGroup ? 'black' : el.point.color
    }

    return {
        chart: {
            type: 'networkgraph',
            export: true,
            // height: '100%',
            // backgroundColor: '#261b6f',
            backgroundColor: backgroundColorMap,
            plotBorderWidth: 0,
            events: {
                load: function() {
                    const chart = this;
                    const container = this.container
                    const pointer = this.pointer;
                    const inverted = this.inverted
                    const plotLeft = this.plotLeft
                    const plotTop = this.plotTop
                    const plotWidth = this.plotWidth
                    const plotHeight = this.plotHeight

                    //Обработка контекс меню
                    container.oncontextmenu = function(e) {

                        const hoverPoint = chart.hoverPoint,
                            chartPosition = pointer.chartPosition;

                        this.rightClick = true;

                        e = pointer.normalize(e);

                        e.cancelBubble = true; // IE specific
                        e.returnValue = false; // IE 8 specific

                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }

                        if (e.preventDefault) {
                            e.preventDefault();
                        }

                        if (!pointer.hasDragged) {
                            if (hoverPoint && pointer.inClass(e.target, 'highcharts-tracker')) {
                                const plotX = hoverPoint.plotX,
                                    plotY = hoverPoint.plotY;

                                // add page position info
                                Highcharts.extend(hoverPoint, {
                                    pageX: chartPosition.left + plotLeft +
                                        (inverted ? plotWidth - plotY : plotX),
                                    pageY: chartPosition.top + plotTop +
                                        (inverted ? plotHeight - plotX : plotY)
                                });

                                hoverPoint.firePointEvent('contextmenu', e);
                            }
                        }
                    }


                },
            }
        },
        exporting: {
            enabled: true,
            sourceWidth: windowDimensions.width,
            sourceHeight: windowDimensions.height
        },
        title: {
            text: '',
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: formatTooltip,
            shared: true
        },
        plotOptions: {
            networkgraph: {
                layoutAlgorithm: {
                    enableSimulation: false,
                    initialPositions: function() {
                        const chart = this
                        const links = chart?.series?.[0]?.points
                        const hashTable = new Map()

                        links?.forEach(link => {
                            const graphic = link.graphic

                            const toNode = initialDataMap.find((item) => Number(item.id) === Number(link.to))
                            const fromNode = initialDataMap.find((item) => Number(item.id) == Number(link.from))

                            const hashItem = `${toNode.x}_${toNode.y}_${fromNode.x}_${fromNode.y}`

                            if (hashTable.has(hashItem)) {
                                hashTable.get(hashItem).push(link)
                            } else {
                                hashTable.set(hashItem, [link])
                            }

                            graphic.on('click', () => {
                                const result = hashTable.get(hashItem).map((item) =>
                                    ({ name: item.custom.cable.name, id: Number(item.custom.cable.id) }))

                                onClick(link, result, 'link')
                            });

                            graphic.on('mouseover', () => {
                                const lines = hashTable.get(hashItem)
                                const coord = {
                                    x: chart.chart.plotLeft + link.plotX,
                                    y: chart.chart.plotTop + link.plotY
                                }

                                onMouseOver(lines, coord)
                            });

                            graphic.on('mouseout', () => {
                                onMouseOut()
                            });
                        });

                        chart?.nodes?.forEach(function(node) {
                            const tmp = initialDataMap?.find(item => item.id == node.id)

                            if (tmp) {
                                node.plotX = tmp.x
                                node.plotY = tmp.y
                            }
                        });
                    }
                }
            },
            series: {
                minPointLength: 5,
                cursor: 'pointer',
                marker: {
                    fillColor: 'red',
                    symbol: 'circle'
                },
                point: {
                    events: {
                        click: function(e: any) {
                            const allNodes = this?.series?.nodes
                            const point = e?.point

                            const tmp = allNodes
                                ?.filter((item) => item.plotX === point?.plotX && item.plotY === point?.plotY)
                                ?.map((item) => ({ name: item.name, id: Number(item.id) })) || []

                            onClick(e, tmp, 'point')
                        },
                        contextmenu: function(e) {
                            onContextMenu(e, this)
                        }
                    },

                },
                dataLabels: {
                    enabled: false,
                    style: {
                        textOutline: false
                    }
                },
            }
        },
        series: [{
            dragDrop: {
                draggableX: true,
                draggableY: true
            },
            layoutAlgorithm: {
                maxIterations: 0
            },
            nodes,
            data,
            draggable: role === 'super-admin',
            marker: {
                radius: 42,
            },
            dataLabels: {
                shared: true,
                style: {
                    fontSize: `${textSize ? textSize : 10}px`,
                },
                padding: 0,
                formatter: function() {
                    return `
                        <span style="color: ${getColor(this)}">
                            ${this.point.name}
                        </span>
                    `
                }
            },
            link: {
                width: 3,
            },
        }]
    }
}
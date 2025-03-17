import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FC, useEffect, useRef, useState } from 'react'
import networkgraph from 'highcharts/modules/networkgraph'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import base64 from 'base-64'
import { icons } from '@pages/dev/vladimir/NetworkMap/icons'
import { getStateViewParamsFromEntity } from '@shared/utils/states'
import { NetworkMapUtils } from '../ObjectCableMap/utils'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useGetObjects } from '@shared/hooks/useGetObjects'

networkgraph(Highcharts);

interface IObjectCableTable {
    cableClasses?: number[]
    relationsCablePort: number[]
    relationsPortDevice?: number[]
    oidsFilter?: number[],
    height?: any
    portAtrrId?: number
}

const NetworkMap: FC<IObjectCableTable> = ({
    cableClasses,
    relationsCablePort,
    relationsPortDevice,
    oidsFilter,
    height = '100%',
    portAtrrId
}) => {
    const objects = useGetObjects()
    // Размер маркера узла
    const nodeHeight = 32
    const chartComponent = useRef<HighchartsReact.RefObject>(null);
    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const [chartOptions, setChartOptions] = useState<Highcharts.Options>(
        NetworkMapUtils.getChartOptions({
            setObjForModalId,
            setIsModalVisible,
        }))
    const renderCableColor = NetworkMapUtils.getCabelsColors()

    useEffect(() => {
        const node: Highcharts.SeriesNetworkgraphNodesOptions[] = []
        // const node: any[] = []
        const fromToData: Highcharts.SeriesNetworkgraphOptions['data'][] = []
        // const fromToData: any[] = []
        const cables = objects.filter((obj) => cableClasses?.includes(obj.class_id))

        cables.forEach((cable) => {
            const relations = cable?.links_where_left.filter((link) => relationsCablePort.includes(link.relation_id))
            const portA = objects.find((obj) => obj.id == relations[0]?.right_object_id)
            const portB = objects.find((obj) => obj.id == relations[1]?.right_object_id)

            const deviceA = objects.find(
                (obj) =>
                    obj.id ==
                    portA?.links_where_left.find((link) => relationsPortDevice?.includes(link.relation_id))
                        ?.right_object_id
            )


            const deviceB = objects.find(
                (obj) =>
                    obj.id ==
                    portB?.links_where_left.find((link) => relationsPortDevice?.includes(link.relation_id))
                        ?.right_object_id
            )

            if (deviceA !== undefined && deviceB !== undefined
                && (
                    oidsFilter === undefined ||
                    (oidsFilter.includes(deviceA.id) || oidsFilter.includes(deviceB.id))
                )
            ) {
                const getDeviceIcon = (class_id: number, obj_id: number) => {
                    const stateColor =  getStateViewParamsFromEntity(obj_id, 'objects')?.fill ?? 'grey'
                    const icon = icons?.[class_id] ? icons?.[class_id](stateColor) : ''

                    return icon 
                        ? `url(data:image/svg+xml;base64, ${base64.encode(icon)})` 
                        : 'circle'
                }
                
                node.push({
                    id: String(deviceA?.id),
                    color: getStateViewParamsFromEntity(deviceA?.id, 'objects')?.fill ?? 'grey',
                    name: deviceA?.name,
                    dataLabels: {
                        enabled: true,
                        linkTextPath: {
                            enabled: true,
                            attributes: {
                                startOffset: 100,
                            }
                        },
                        y: -25,
                    },
                    marker: {
                        symbol: `${getDeviceIcon(deviceA.class_id, deviceA.id)}`,
                        width: nodeHeight,
                        height: nodeHeight,
                        radius: nodeHeight,
                        states: {
                            hover: {
                                enabled: true,
                                heightPlus: 10,
                                widthPlus: 10,
                                radiusPlus: 10,
                            },
                            inactive: {
                                opacity: 1
                            }
                        }
                    },
                })

                node.push({
                    id: String(deviceB?.id),
                    color: getStateViewParamsFromEntity(deviceB?.id, 'objects')?.fill ?? 'grey',
                    name: String(deviceB?.name),
                    marker: {
                        width: nodeHeight,
                        height: nodeHeight,
                        radius: nodeHeight,
                        states: {
                            hover: {
                                enabled: true,
                                heightPlus: 10,
                                widthPlus: 10,
                                radiusPlus: 10,
                            },
                            inactive: {
                                opacity: 1
                            }
                        },
                        symbol: `${getDeviceIcon(deviceB?.class_id, deviceB?.id)}`,
                    },
                    dataLabels: {
                        enabled: true,
                        y: -25,
                        linkTextPath: {
                            enabled: true,
                            attributes: {
                                startOffset: 0,
                            }
                        },
                    },
                })

                fromToData.push({ 
                    from: String(deviceB?.id), 
                    to: String(deviceA?.id), 
                    color: renderCableColor[cable.class_id],
                    custom: {
                        cable: cable ?? 'No cable',
                        from: {
                            portB,
                            deviceB,
                            stateColorB: getStateViewParamsFromEntity(deviceB?.id, 'objects')?.fill ?? 'grey'
                        },
                        to: {
                            portA,
                            deviceA,
                            stateColorA: getStateViewParamsFromEntity(deviceA?.id, 'objects')?.fill ?? 'grey'
                        }
                    }
                } as Highcharts.SeriesNetworkgraphOptions['data'])
            }
        })
        
        setChartOptions({
            ...chartOptions,
            series: {
                ...chartOptions.series,
                nodes: node,
                data: fromToData,
                dataLabels: {
                    formatter: function() {
                        // console.log('formatter', this)

                        return `
                        <span 
                            style="color: ${this.point.color}; font-size: 8px;"
                        >
                            ${this.point.name}
                        </span>`
                    },
                    linkFormatter: function() {
                        //     // console.log('linkFormatter', this)

                        //     // return this.point.custom.portB.name + ' - ' + this.point.custom.portA.name
                        //     return `
                        //         <span style="font-size: 10px">
                        //             <span 
                        //                 style="color: ${this.point.custom.from.stateColorB};"
                        //             >
                        //                 ${this.point.custom.from.portB.id} - 
                        //             </span>
                        //             <span 
                        //                 style="color: ${this.point.custom.to.stateColorA};"
                        //             >
                        //                 ${this.point.custom.to.portA.id}
                        //             </span>
                        //         </span>`
                        //     /* return `
                        //         <span style="font-size: 10px">
                        //             <span style="color: ${this.point.custom.from.stateColorB};">
                        //                 ${this.point.from} - 
                        //             </span>
                        //             <span style="color: ${this.point.custom.to.stateColorA};">${this.point.to}</span>
                        //         </span>` */
                        return ''
                    }
                },
                link: {
                    width: 3,
                },
                zIndex: 100
            },
        } as Highcharts.Options)

        /* const chart = chartComponent.current.chart
        
        if (chart) {
            chart.update({
                series: {
                    nodes: node,
                    data: fromToData,
                    dataLabels: {
                        linkFormatter: function() {
                            // console.log('this dataLabels', this)
    
                            // return this.point.custom.portB.name + ' - ' + this.point.custom.portA.name
                            return this.point.from + ' - ' + this.point.to
                        }
                    },
                    link: {
                        width: 3,
                    },
                    zIndex: 100
                },
            })
        } */

    }, [objects])

    const handleClose = () => {
        setIsModalVisible(false)
        setObjForModalId(undefined)  
    }

    return (
        <div style={height ? { height } : { height: '100%', width: '100%' }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                containerProps={{ style: height ? { height } : { height: '100%', flex: 1 } }}
                ref={chartComponent}
            />
            <ObjectCardModal objectId={objForModalId} modal={{ open: isModalVisible, onCancel: handleClose }} />
        </div>
    )
}

export default NetworkMap;
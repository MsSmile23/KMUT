import { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'
import { selectAttributeByIndex, useAttributesStore } from '@shared/stores/attributes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
import { IObject } from '@shared/types/objects'

interface IAttributeValueContainerProps {
    viewType: 'text' | 'histogram'
    attributes: number[]
    linkedObjectsForm?: ILinkedObjectsForm
    aggregation: 'sum' | 'average'
    ratio: number
    textLabel?: string
    textUnit?: string
    textFontsize: number
    textPosition:
        | 'topLeft'
        | 'topCenter'
        | 'topRight'
        | 'centerLeft'
        | 'center'
        | 'centerRight'
        | 'bottomLeft'
        | 'bottomCenter'
        | 'bottomRight'

    histogramColumnColor: string
    histogramMaxValue: number
    histogramUnit: string
    customAttrLabels?: any
    histogramDirection: 'horizontal' | 'vertical'
    objectId?: number
}
const AttributeValueContainer: FC<IAttributeValueContainerProps> = ({
    viewType,
    attributes,
    linkedObjectsForm,
    aggregation = 'sum',
    ratio = 1,
    textLabel,
    textUnit,
    textFontsize = 96,
    textPosition = 'center',
    histogramMaxValue,
    histogramUnit,
    histogramColumnColor,
    customAttrLabels,
    histogramDirection,
    objectId
}) => {
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const getAttributeByIndex = useAttributesStore(selectAttributeByIndex)
    const [value, setValue] = useState<any>({})
    const [histogramData, setHistogramData] = useState<any[]>([])
    const [clientHeight, setClientHeight] = useState(0)
    const [clientWidth, setClientWidth] = useState(0)
    const ref = useRef(null)

    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
        setClientWidth(ref.current.clientWidth)
    }, [])
    const textPositionsStyles = useMemo(() => {
        switch (textPosition) {
            case 'topLeft':
                return {
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }

            case 'topCenter':
                return {
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }
            case 'topRight':
                return {
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                }

            case 'centerLeft':
                return {
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }
            case 'center':
                return {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            case 'centerRight':
                return {
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }
            case 'bottomLeft':
                return {
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                }
            case 'bottomCenter':
                return {
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }

            case 'bottomRight':
                return {
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                }
            default:
                return {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
        }
    }, [textPosition])

    useEffect(() => {
        if (linkedObjectsForm) {
            const localValue = {}
            let objectsCount = 0


            attributes.forEach((item) => {
                localValue[item] = 0
            })

            //*Ищем связанные объекты(если нет базового, ищем все с классом)
            let linkedObjects: IObject[] = []


            if (linkedObjectsForm?.baseObject || objectId) {
                const tmpLinkedObjects = findChildObjectsWithPaths({
                    childClassIds: linkedObjectsForm.connectingClasses,
                    targetClassIds: linkedObjectsForm.targetClasses,
                    currentObj:
                        getObjectByIndex('id', linkedObjectsForm?.baseObject) ??
                        getObjectByIndex('id', objectId),

                    filter: {
                        linkedObjects:
                            linkedObjectsForm?.linkedObjects
                                ?
                                [
                                    {
                                        classId: linkedObjectsForm?.linkedObjectsClasses,
                                        objectIds: linkedObjectsForm?.linkedObjects,
                                    },
                                ]
                                : []
                    },
                })

                tmpLinkedObjects?.objectsWithPath?.forEach(item => {
                    linkedObjects.push(getObjectByIndex('id', item.id))
                })

                //.objectsWithPath.map((item) => item.id)
                //.map((item) => getObjectByIndex('id', item))
            } else {
                linkedObjects = linkedObjectsForm.targetClasses?.flatMap((cl) => getObjectByIndex('class_id', cl))
            }


            //*В случае, если выбраны определенные объекты для вывода
            if (linkedObjectsForm?.chosenObjectsIds?.length > 0) {
                linkedObjects = linkedObjectsForm?.chosenObjectsIds?.map((id) => getObjectByIndex('id', id))
            }


            objectsCount = linkedObjects?.length

            // attributes.forEach((item) => {
            //     localValue[item] = 0
            // })


            //TODO:: оптимизировать переносом в циклы обработки связанных объектов выше, чтобы избежать второго прохода

            linkedObjects.forEach((obj) => {

                obj?.object_attributes.forEach((oa) => {
                    if (attributes.includes(oa?.attribute_id)) {
                        localValue[oa?.attribute_id] += Number(oa?.attribute_value)
                    }
                })
            })

            //*Если выбрано среднее, вычисляем среднее значение
            if (aggregation == 'average') {
                Object.keys(localValue).forEach((key) => {
                    localValue[key] = localValue[key] / objectsCount
                })
            }

            //*Если есть коэффициент, умножаем на коэффициент
            if (ratio) {
                Object.keys(localValue).forEach((key) => {
                    localValue[key] = localValue[key] * ratio
                })
            }

            if (viewType == 'text') {
                setValue(localValue)
            }

            if (viewType == 'histogram') {
                const chartData: any[] = []

                Object.keys(localValue).forEach((item) => {
                    const attribute = getAttributeByIndex('id', Number(item))


                    chartData.push({
                        name: customAttrLabels[item] ?? attribute?.name,
                        y: localValue[item],
                        color: histogramColumnColor || 'grey',
                        unit: histogramUnit,
                    })
                })

                setHistogramData(chartData)
            }
        }
    }, [linkedObjectsForm, attributes])

    const renderComponent = () => {
        switch (viewType) {
            case 'text':
                return (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            ...textPositionsStyles,
                        }}
                    >
                        <span
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                color: '#7E7E7E',
                                fontSize: '48px',
                            }}
                        >
                            {textLabel}
                        </span>
                        <div style={{ textAlign: 'center' }}>
                            {Object.values(value).map((item: number, index) => {
                                return (
                                    <span key={index} style={{ fontSize: `${textFontsize}px`, textAlign: 'center' }}>
                                        {item}
                                    </span>
                                )
                            })}

                            <span
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    color: '#7E7E7E',
                                    fontSize: '48px',
                                }}
                            >
                                {textUnit}
                            </span>
                        </div>
                    </div>
                )

            case 'histogram':
                return (
                    <div style={{ width: clientWidth, maxWidth: '100%' }}>
                        <HighchartsReact
                            // ref={chartRef}
                            highcharts={Highcharts}
                            options={{
                                chart: {
                                    type: histogramDirection == 'vertical' ? 'bar' : 'column',
                                    height: clientHeight - 10,
                                },
                                title: {
                                    align: 'left',
                                    text: '',
                                },
                                subtitle: {
                                    align: 'left',
                                    text: '',
                                },
                                accessibility: {
                                    announceNewData: {
                                        enabled: true,
                                    },
                                },
                                xAxis: {
                                    type: 'category',
                                },
                                yAxis: {
                                    max: histogramMaxValue ? Number(histogramMaxValue) : undefined,
                                    offset: -2,
                                    crosshair: false,
                                    title: {
                                        text: '',
                                    },
                                    lineWidth: 3,
                                    // lineColor: chartSettings?.axisColor, // Цвет оси Y
                                    gridLineDashStyle: 'dash',
                                    gridLineColor: 'rgb(143, 143, 143)',
                                    labels: {
                                        style: {
                                            cursor: 'default',
                                            fontSize: '12px',
                                            fontWeight: 400,
                                            // color: chartSettings?.labelColor // Цвет подписей на оси Y
                                        },
                                    },
                                },
                                legend: {
                                    enabled: false,
                                },
                                credits: {
                                    enabled: false,
                                },
                                plotOptions: {
                                    series: {
                                        borderWidth: 0,
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.y:.1f}{point.unit}',
                                        },
                                    },
                                },

                                tooltip: {
                                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                    pointFormat:
                                        '<span style="color:{point.color}">{point.name}</span>: ' +
                                        '<b>{point.y:.2f}{point.unit}</b><br/>',
                                },

                                series: [
                                    {
                                        name: '',
                                        colorByPoint: true,
                                        data: histogramData,
                                    },
                                ],
                            }}
                            style={{ width: '100%', height: 'auto' }}
                        />

                        {/* <ColumnChartContainer
                            data = {histogramData}
                            chartSettings={{
                                maxValue: 100,
                                height: clientHeight 
                            }}
                        /> */}
                    </div>
                )
            default:
                return <></>
        }
    }

    return (
        <div style={{ width: '100%' }} ref={ref}>
            {renderComponent()}
        </div>
    )
}

export default AttributeValueContainer
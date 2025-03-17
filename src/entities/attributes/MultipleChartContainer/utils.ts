/* eslint-disable max-len */
import { IMultipleChartFormPart } from '@containers/widgets/WidgetMultipleChart/MultipleChartForm'
import { SERVICES_ATTRIBUTE_HISTORY } from '@shared/api/AttributeHistory'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { IObjectAttribute } from '@shared/types/objects'
import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import { IExtendedObjectAttribute, IMultipleChartContainerProps } from './MultipleChartContainer'
import { useObjectsStore } from '@shared/stores/objects'

export const getOAseries = async ({ 
    OAttrs, axisProps, dateIntervals, status, setSeriesAxisState, setStatus, commonSettings, limit, themeColors
}: {
    OAttrs: IExtendedObjectAttribute[],
    axisProps: IMultipleChartFormPart[],
    dateIntervals?: [string, string],
    status: 'idle' | 'loading' | 'finished'
    setStatus?: (status: 'idle' | 'loading' | 'finished') => void
    setSeriesAxisState?: ({ currentSeries, options }: {
        currentSeries: Highcharts.SeriesLineOptions[]
        options: Highcharts.Options
    }) => void
    commonSettings?: IMultipleChartContainerProps['commonSettings']
    limit?: number,
    themeColors?: any
}) => {
    // console.log('OAttrs', OAttrs)
    const axisPropsAllAttrs = axisProps?.reduce((acc, axis) => ([...acc, ...axis.attributeIds]), [])
    const getObjectByIndex = useObjectsStore.getState().getByIndex
    // console.log('axisPropsAllAttrs', axisPropsAllAttrs)

    if (axisPropsAllAttrs?.length > 0) {
        (status === 'idle' || status === 'finished') && setStatus('loading')

        const currentSeries: Highcharts.SeriesLineOptions[] = []
        const options: Highcharts.Options = {
            chart: {
                type: 'line',
                events: {}
            },
       
        }

        if (themeColors) {
            options.chart.backgroundColor = themeColors.background
        }


        const axisOptions: Highcharts.YAxisOptions[] = axisProps.map(axis => ({
            id: axis?.axisID,
        }))
        const chosenAttrs = axisProps && axisProps.length > 0 &&
            axisProps?.reduce((acc, axis) => ([...acc, ...axis.attributeIds]), []).length > 0
            // если есть хотя бы один атрибут в настройках осей, то 
            ? axisProps?.reduce((acc, axis) => ([...acc, ...axis.attributeIds]), [])
            : OAttrs?.map(oa => oa.attribute_id)
        // : []
        const { data: filteredOAttrs } = await SERVICES_OBJECTS.Models.getObjectAttributes({
            all: true,
            ['filter[id]']: OAttrs.map(oa => oa.id)
        })

        // console.log('chosenAttrs', chosenAttrs)
        
        let lastPoint: number

        for (const OAttr of OAttrs) {
        // for (const OAttr of filteredOAttrs) {
            if (chosenAttrs.includes(OAttr.attribute_id) &&
                filteredOAttrs.findIndex(oa => oa.attribute_id === OAttr.attribute_id) > -1) {
                const axisPropsIdx = axisProps?.findIndex(axis => axis.attributeIds.includes(OAttr.attribute_id))
                const currentObject = getObjectByIndex('id', OAttr.object_id)
                // const currentAxisIDx = axisOptions.findIndex(axis => axis.id === axisProps?.[axisPropsIdx]?.axisID)
                // console.log('currentAxisIDx', OAttr.id, currentAxisIDx)

                let serieUnit = ''

                if (axisPropsAllAttrs.length > 0) {
                    if (axisPropsIdx > -1) {
                        const limitPayload = limit ? { limit } : {}
        
                        const dateIntervalsPayload = (!dateIntervals?.[0] || !dateIntervals?.[1]) 
                            ? {
                                ...limitPayload
                            }
                            : {
                                start: dateIntervals?.[0], 
                                end: dateIntervals?.[1],
                            }

                        const payload = {
                            id: OAttr.id,
                            ...dateIntervalsPayload
                        }

                        const response = await SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById(payload)
                    
                        // console.log('YES response.data', OAttr.id, response.data)
                        const yAxisOption = axisPropsIdx
                            ? { yAxis: axisPropsIdx }
                            : {}
                    
                        let valueConverter

                        if (response.success) {
                            if (response.data && response.data?.series) {
                                response.data.series.forEach((serie) => {
                                    valueConverter = serie?.params?.view?.value_converter
                                    const points = serie?.data.map((point) => {
                                        const msTimeStamp = point[0] * 1000

                                        const newPoint = [
                                            msTimeStamp,
                                            typeof point[1] == 'string' ? parseFloat(point[1] as string) : point[1]
                                        ]

                                        return newPoint as [number, number]
                                    })
                                        .sort((a, b) => a[0] - b[0])
                                    
                                    if (lastPoint) {
                                        if (points.at(-1)?.[0] && lastPoint < points.at(-1)[0]) {
                                            lastPoint = points.at(-1)[0]
                                        }
                                    } else {
                                        if (points.at(-1)?.[0]) {
                                            lastPoint = points.at(-1)[0]
                                        }
                                    }

                                    serieUnit = !serieUnit && serie.unit
                                    const name = serie.name ?? response.data?.name
                                    const noData = serie?.data.length === 0 ? ' (Нет данных)' : ''
                                    const selectedName = OAttr.showAttrValue
                                        ? typeof OAttr.showAttrValue === 'string'
                                            ? currentObject[OAttr.showAttrValue]
                                            : OAttr.showAttrValue
                                        : ''
                                    const preparedSerie: Highcharts.SeriesLineOptions = {
                                        type: 'line',
                                        name: OAttr.forceShow 
                                            ? selectedName 
                                                ? selectedName
                                                : currentObject.name
                                            : `${name} ${selectedName ? ` (${selectedName}) ` : ''}${noData}`,
                                        // : `${name} [${OAttr.id}]${selectedName ? ` (${selectedName}) ` : ''}${noData}`,
                                        data: points,
                                        connectNulls: true,
                                        custom: {
                                            params: {
                                                view: {
                                                    type: serie?.params?.view?.type,
                                                    max: serie?.params?.view?.max,
                                                    min: serie?.params?.view?.min,
                                                    value_converter: serie?.params?.view?.value_converter
                                                },
                                                unit: serie?.unit,
                                                id: OAttr.id,
                                                attrId: OAttr.attribute_id,
                                                serName: serie?.name
                                            },
                                            axisID: axisProps[axisPropsIdx]?.axisID
                                        },
                                        ...yAxisOption
                                    }
                                        
                                    currentSeries.push(preparedSerie)
                                })
                            }
                        } else {
                            const preparedSerie: Highcharts.SeriesLineOptions = {
                                type: 'line',
                                data: [],
                                name: `<span>
                                    <span style="color: red;">Ошибка загрузки<span><br/> 
                                    <span style="color: black; text-decoration: line-through;">
                                        ${OAttr.attribute.name} [${OAttr.id}]
                                    </span>
                                </span>`,
                                connectNulls: true,
                                custom: {
                                    error: response.error,
                                    attr: {
                                        name: OAttr.attribute.name,
                                        id: OAttr.id,
                                        attrId: OAttr.attribute_id,
                                    },
                                    axisID: axisProps[axisPropsIdx]?.axisID
                                },
                                ...yAxisOption
                            }

                            currentSeries.push(preparedSerie)

                        }
                        
                        // if (currentAxisIDx < 0) {
                        if (axisPropsIdx > -1) {
                            const yAxisObject: Highcharts.YAxisOptions = {
                                labels: {
                                    style: { color: themeColors?.color || '#000000' },
                                    allowOverlap: false,
                                    align: 'left', // нужно для резервирования места под лейблы
                                    formatter: function() {
                                        // console.log('yAxis label', this)
                                        // если есть конвертер значений, то переименовать лейблы оси у
                
                
                                        if (valueConverter) {
                                            const newValue = valueConverter.find(item => item.source == this.value)
                
                                            // console.log('newValue', newValue)
                
                                            return newValue?.converted
                                        }
                
                                        return `${this.value} ${axisProps[axisPropsIdx]?.unit ?? serieUnit ?? ''}`
                                    }
                                },
                                lineColor: themeColors?.color || '#000000',
                                max: serieUnit === '%' 
                                    ? 100 
                                    : axisProps[axisPropsIdx]?.maxValue,
                                min: axisProps[axisPropsIdx]?.minValue,
                                id: axisProps[axisPropsIdx]?.axisID,
                                // id: `yAxis-${OAttr.id}`,
                                lineWidth: 1,
                                title: {
                                    text: axisProps[axisPropsIdx]?.axisName,
                                    align: 'high',
                                    rotation: 90,
                                },
                                margin: 5,
                                showLastLabel: true,
                            }
        
                            axisOptions[axisPropsIdx] = yAxisObject
                            // axisOptions.push(yAxisObject)
                        }
                    }
                }
                // } else {
                //     const response = await SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById({
                //         id: OAttr.id,
                //         start: dateIntervals[0],
                //         end: dateIntervals[1]
                //     })
                
                //     // console.log('NOT response.data', OAttr.id, response.data)
                

                //     if (response.success) {
                //         if (response.data && response.data?.series) {
                //             response.data.series.forEach((serie) => {
                //                 const points = serie?.data.map((point) => {
                //                     const msTimeStamp = point[0] * 1000

                //                     const newPoint = [
                //                         msTimeStamp,
                //                         typeof point[1] == 'string' ? parseFloat(point[1] as string) : point[1]
                //                     ]

                //                     return newPoint as [number, number]
                //                 })
                //                     .sort((a, b) => a[0] - b[0])

                //                 const preparedSerie: Highcharts.SeriesLineOptions = {
                //                     type: 'line',
                //                     name: serie.name 
                //                         ? `${serie.name} [${OAttr.id}]` 
                //                         : `${response.data?.name} [${OAttr.id}]`,
                //                     data: points,
                //                     connectNulls: true,
                //                     custom: {
                //                         params: {
                //                             view: {
                //                                 type: serie?.params?.view?.type,
                //                                 max: serie?.params?.view?.max,
                //                                 min: serie?.params?.view?.min,
                //                                 value_converter: serie?.params?.view?.value_converter
                //                             },
                //                             unit: serie?.unit,
                //                             id: OAttr.id,
                //                             serName: serie?.name
                //                         }
                //                     },
                //                     visible: false,
                //                     events: {
                //                         legendItemClick: function() {
                //                             console.log('this legendItem', this)
                //                         }
                //                     },
                //                     yAxis: 0
                //                 }
                                    
                //                 currentSeries.push(preparedSerie)
                //             })
                //         }
                //     } else {
                //         // 
                //     }
                // }


            }
            
            // if (index === OAttrs.length) {
            //     setStatus('finished')
            // }
        }
        options.yAxis = axisOptions
        options.tooltip = {
            padding: 10,
            borderColor: '#000',
            backgroundColor: '#fff',
            borderWidth: 2,
            outside: false,
            shared: true,
            split: false,
            useHTML: true,
            distance: 20,
            formatter: function() {
            // formatter: function(this: { point, points, series }) {
                // console.log('this tooltip', this)

                const roundTo = (val: number, count = 2) => {
                    if (val - Math.floor(val) === 0) {
                        return val
                    }
                    const coef = Math.pow(10, count)

                    return Math.round(val * coef) / coef
                }

                const getDate = (time: number) => {
                    return dayjs(time).format('HH:mm:ss DD-MM-YYYY')
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
                            // eslint-disable-next-line max-len
                            ? `[${currId}] ${point?.series?.name} - 
                                ${valueConverter.find(item => item.source == point?.y).converted}<br/>`
                            : ''
                        // eslint-disable-next-line max-len
                        const ordinalValueTtip = `[${currId}] ${point?.series?.name} - ${roundTo(point?.y)} ${point?.series?.options?.custom?.params?.unit ?? ''}<br/>`

                        // тултип главной серии
                        newTooltip += `
                            <span style="color: ${point?.color}; font-weight: bold;">
                                ${valueConverter ? convertedValueTooltip : ordinalValueTtip}
                            </span>
                        `
                    })

                } else {
                    // Если только одна серия
                    const valueConverter = this?.point?.series?.options?.custom?.params?.view?.value_converter

                    // id серии для дебага
                    const currId = `${this?.series?.options?.custom?.params?.id}`

                    // с конвертацией
                    const convertedValueTooltip = valueConverter
                        ? `[${currId}] ${(this?.series?.name)} - 
                            ${valueConverter.find(item => item.source == this?.point?.y).converted}}<br/>`
                        : ''

                    // без конвертации
                    const ordinalValueTtip = `[${currId}] ${(this?.series?.name)} - 
                        ${roundTo(this?.point?.y)} ${this?.series?.options?.custom?.params?.unit ?? ''}<br/>`


                    // тултип главной серии
                    newTooltip += `
                        <span style="color: ${this.point?.color}; font-weight: bold;">
                            ${valueConverter ? convertedValueTooltip : ordinalValueTtip}
                        </span>
                    ` 
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
        }
        const startOfPeriod = commonSettings?.defaultPeriod 
            ? dayjs(lastPoint).subtract(1, commonSettings.defaultPeriod).unix() * 1000
            : undefined

        options.plotOptions = {
            ...options.plotOptions,
            line: {
                ...options.plotOptions?.line,
                custom: {
                    currentInterval: commonSettings?.defaultPeriod
                        ? {
                            startPoint: startOfPeriod,
                            lastPoint,
                        } 
                        : undefined
                }
            }
        }
        // console.log('currentSeries', currentSeries)
        setSeriesAxisState({
            options,
            currentSeries
        })

        setStatus('finished')
    }
}
interface IGetAttrHistoryParams {
    id: IObjectAttribute['id']
    dateIntervals?: [string, string]
    yAxisIndex?: number
    yAxis?: IMultipleChartFormPart
    setSerie: (serie: Highcharts.SeriesLineOptions) => void
}
type IGetAttrHistory = (params: IGetAttrHistoryParams) => Promise<Highcharts.SeriesLineOptions[]>
export const getAttrHistory: IGetAttrHistory = async ({
    id,
    dateIntervals = [null, null],
    yAxisIndex,
    // yAxis,
    setSerie
}) => {


    const response = await SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById({
        id: id,
        start: dateIntervals[0],
        end: dateIntervals[1]
    })

    // console.log('response.data', id, response.data)
    const yAxisOption = yAxisIndex
        ? { yAxis: yAxisIndex }
        : {}


    if (response.success) {
        if (response.data && response.data?.series) {
            const preparedSeries: Highcharts.SeriesLineOptions[] = response.data.series.reduce((acc, serie) => {
                const preparedSerie: Highcharts.SeriesLineOptions = {
                    type: 'line',
                    name: serie.name ?? response.data?.name,
                    data: serie?.data,
                    connectNulls: true,
                    custom: {
                        params: {
                            view: {
                                type: serie?.params?.view?.type,
                                max: serie?.params?.view?.max,
                                min: serie?.params?.view?.min,
                                value_converter: serie?.params?.view?.value_converter
                            },
                            unit: serie?.unit,
                            id: id,
                            serName: serie?.name
                        }
                    },
                    ...yAxisOption
                }

                setSerie(preparedSerie)
                acc.push(preparedSerie)

                return acc
            }, [] as Highcharts.SeriesLineOptions[])

            /* if (yAxis) {
                getAxisOptions({
                    serieParams: preparedSeries[0].custom,
                })
            } */

            return preparedSeries
        }
    } else {
        return []
    }
}
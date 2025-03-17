/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
import { Card, Form, Spin } from 'antd'
import { DemoOAIndicatorsForm } from './DemoOAIndicatorsForm'
import { useEffect, useState } from 'react'
import { LineChart } from '@shared/ui/charts/highcharts/Charts'
import { SERVICES_ATTRIBUTE_HISTORY } from '@shared/api/AttributeHistory'
import moment from 'moment'
import Highcharts, { Options, SeriesLineOptions } from 'highcharts/highstock'
import StockTools from 'highcharts/modules/stock-tools'
import { Select } from '@shared/ui/forms'
import { useForm } from 'antd/es/form/Form'
import more from 'highcharts/highcharts-more'

import Indicators from 'highcharts/indicators/indicators'
import Bollinger from 'highcharts/indicators/bollinger-bands'
import AccelerationBands from 'highcharts/indicators/acceleration-bands'
import DEMA from 'highcharts/indicators/dema'
import EMA from 'highcharts/indicators/ema'
// import Ichimoku from 'highcharts/indicators/ichimoku-kinko-hyo'
import Atr from 'highcharts/indicators/atr'
import KeltnerChannels from 'highcharts/indicators/keltner-channels'
import Regressions from 'highcharts/indicators/regressions'
import PivotPoints from 'highcharts/indicators/pivot-points'
import PriceChannel from 'highcharts/indicators/price-channel'
import PriceEnvelopes from 'highcharts/indicators/price-envelopes'
import ParabolicSAR from 'highcharts/indicators/psar'
import SuperTrend from 'highcharts/indicators/supertrend'
import TEMA from 'highcharts/indicators/tema'
import Trendline from 'highcharts/indicators/tema'
import VbP from 'highcharts/indicators/volume-by-price'
import VWAP from 'highcharts/indicators/vwap'
import WMA from 'highcharts/indicators/wma'
import ZigZag from 'highcharts/indicators/zigzag'

more(Highcharts)
Indicators(Highcharts)
Bollinger(Highcharts)
AccelerationBands(Highcharts)
DEMA(Highcharts)
EMA(Highcharts)
// Ichimoku(Highcharts)
Atr(Highcharts)
KeltnerChannels(Highcharts)
Regressions(Highcharts)
PivotPoints(Highcharts)
PriceChannel(Highcharts)
PriceEnvelopes(Highcharts)
ParabolicSAR(Highcharts)
SuperTrend(Highcharts)
TEMA(Highcharts)
Trendline(Highcharts)
VbP(Highcharts)
VWAP(Highcharts)
WMA(Highcharts)
ZigZag(Highcharts)

StockTools(Highcharts)

type TLoadingStatus = 'idle' | 'loading' | 'finished'

const availableIndicatorsList = [
    { value: 'bollinger-bands', label: 'Bollinger Bands', code: 'bb' },
    { value: 'acceleration-bands', label: 'Acceleration Bands', code: 'abands' },
    { value: 'dema', label: 'Double Exponential Moving Average', code: 'dema' },
    { value: 'ema', label: 'Exponential Moving Average', code: 'ema' },
    // { value: 'ikh', label: 'Ichimoku Kinko Hyo', code: 'ikh' },
    // { value: 'keltner-channels', label: 'Keltner Channels', code: 'keltnerchannels' },
    { value: 'regressions', label: 'Linear Regression', code: 'linearRegression' },
    { value: 'pivot-points', label: 'Pivot Points', code: 'pivotpoints' },
    { value: 'price-channel', label: 'Price Channel', code: 'pc' },
    { value: 'price-envelopes', label: 'Price Envelopes', code: 'priceenvelopes' },
    // { value: 'psar', label: 'Parabolic SAR', code: 'psar' },
    { value: 'sma', label: 'Simple Moving Average', code: 'sma' },
    { value: 'supertrend', label: 'Super Trend', code: 'supertrend' },
    { value: 'tema', label: 'Triple Exponential Moving Average', code: 'tema' },
    // { value: 'volume-by-price', label: 'Volume by Price', code: 'vbp' },
    { value: 'zigzag', label: 'Weighted Moving Average', code: 'zigzag' },
]

interface IChartIndicator {
    band: string
    average: string
}
export const DemoOAIndicators = () => {
    const [OAIds, setOAIds] = useState<number[]>([]) 
    const [status, setStatus] = useState<TLoadingStatus>('idle')

    const [currentIndicator, setCurrentIndicator] = useState<keyof IChartIndicator | ''>('') 
    const [chartData, setChartData] = useState<SeriesLineOptions[]>([]) 
    const [customOptions, setCustomOptions] = useState<Options>({
        chart: {
            // events: {
            //     render: function() {
            //     }
            // },
            height: 400,
            marginTop: 25,
            type: 'line'
        },
        stockTools: {
            gui: {
                enabled: true
            }
        }
    }) 

    const [form] = useForm()
    const chosenIndicator = availableIndicatorsList.find(indicator => indicator.value === currentIndicator)

    const getChartData = async () => {
        const tempData = [] as SeriesLineOptions[]
        let changeOpts: Options = {}
        let mainMax: number
        let mainMin: number

        setStatus('loading')
        for (const id of OAIds) {
            const response = await SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById({ id })
                
            if (response.success) {
                // tempData.push(response.data)
                if (response.data.series) {
                    response.data.series.forEach((serie) => {
                        let fastValueConverter
                                    
                        if (serie?.params?.view?.value_converter) {
                            fastValueConverter = serie?.params?.view?.value_converter.reduce((acc, vc) => {
                                if (!acc[vc.source]) {
                                    acc[vc.source] = vc.order ?? vc.source
                                }

                                return acc
                            }, {})    
                        }

                        mainMax = serie?.params?.view?.value_converter
                            ? serie?.params?.view?.value_converter.reduce((max, item) => {
                                return Number(item.source) > max 
                                    ? Number(item.source) 
                                    : max
                            }, 0)
                            : serie?.params?.view?.max,
                        mainMin = serie?.params?.view?.min

                        const points = serie?.data
                            .map((item) => {
                                const msTimeStamp = item[0] * 1000
                                const newValue = fastValueConverter 
                                    ? fastValueConverter[item[1]]
                                    : item[1]
                                const point = [
                                    msTimeStamp,
                                    typeof newValue == 'string' 
                                        ? parseFloat(newValue as string)
                                        : newValue
                                ]
        
                                return point as [number, number]
                            })
                            .sort((a, b) => a[0] - b[0])
                    
                        tempData.push({
                            type: 'line',
                            name: serie.name ?? response?.data?.name,
                            id: `${id}`,
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
                                    unit: serie?.unit ?? '',
                                    id: id,
                                    serName: serie.name ?? response?.data?.name
                                }
                            }
                        })
                        
                        if (chosenIndicator) {
                            tempData.push({
                                type: chosenIndicator.code as SeriesLineOptions['type'],
                                linkedTo: `${id}`,
                                params: {
                                    period: 20,
                                    standardDeviation: 2
                                }
                            })
                        }

                        changeOpts = {
                            yAxis: [{
                                labels: {
                                    //@ts-ignore
                                    formatter: function() {
                                        // если есть конвертер значений, то переименовать лейблы оси у
                                        if (serie?.params?.view?.value_converter) {
                                            return serie?.params?.view?.value_converter
                                                .find(item => {
                                                    return  item?.order
                                                        ? item.order === this.value
                                                        : item.source == this.value
                                                })?.converted ?? this.value
                                        }

                                        return `${this.value} ${serie?.unit ?? ''}`
                                    }
                                },
                                max: mainMax,
                                min: mainMin ?? 0,
                                tickInterval: serie?.params?.view?.value_converter 
                                    ? 1
                                    : undefined 
                            }]
                        }


                    })
                    setStatus('finished')
                }
            }
            
        }
    
        setChartData(tempData)

        const newOptions = {
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
                formatter: function(this: { point, points, series }) {
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
                                // eslint-disable-next-line max-len
                                ? `[${currId}] ${point?.series?.name} - 
                                    ${valueConverter.find(item => item.source == point?.y)?.converted}<br/>`
                                : ''
                            // eslint-disable-next-line max-len
                            const ordinalValueTtip = `[${currId}] ${point?.series?.name} - ${roundTo(point?.y)} ${point?.series?.options?.custom?.params?.unit ?? ''}<br/>`

                            // тултип главной серии
                            newTooltip += `
                                <span style="color: ${point?.color}; font-weight: bold;">
                                    ${valueConverter ? convertedValueTooltip : ordinalValueTtip}
                                </span>
                            `

                            

                            /* // проверка, есть ли у данной серии сабсерии
                            const currentMainSerie = mainSubSeriesRelations.current.find(item => {
                                return item.mainId === point?.series?.options?.custom?.params?.id &&
                                    item.mainSerieName === point?.series?.options?.custom?.params?.serName
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
                            } */
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

                        /* // тултип всех сабсерий, если таковые имеются
                        // при скрытии серии в легенде, пропадают тултипы сабсерий, которые связаны с главной
                        const currentMainSerie = mainSubSeriesRelations.current.find(item => {

                            return item.mainId === this.point?.series?.options?.custom?.params?.id &&
                                item.mainSerieName === this.point?.series?.options?.custom?.params?.serName
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
                        } */
                    }

                    return newTooltip
                },
            },
        } as Options

        setCustomOptions(Highcharts.merge(customOptions, newOptions, changeOpts))
    }

    useEffect(() => {
        getChartData().then()
    }, [OAIds, currentIndicator])

    const getFormValues = (values) => {
        setOAIds(values.objectAttributeIds)
    }
    
    const handleIndicatorsChange = (value, values) => {
        setCurrentIndicator(value['indicators'])

        return value
    }

    return (
        <>
            <Card>
                <DemoOAIndicatorsForm 
                    getFormValues={getFormValues}
                />

            </Card>
            <Card 
                style={{ 
                    position: 'relative',
                    marginTop: 20 
                }}
            >
                
                {OAIds.length > 0 
                    ? status === 'loading'
                        ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 400  
                                }}
                            >
                                <Spin />
                            </div>
                        ) 
                        : chartData.length === 0 
                            ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 400  
                                    }}
                                >
                                    Нет данных
                                </div>
                            )
                            : (
                                <>
                                    <Form
                                        form={form}
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            left: 10,
                                            zIndex: 1000
                                        }}
                                        initialValues={{
                                            indicators: currentIndicator
                                        }}
                                        onValuesChange={handleIndicatorsChange}

                                    >
                                        <Form.Item
                                            name="indicators"
                                            label="Выберите индикатор"
                                            style={{
                                                width: 400
                                            }}
                                        >
                                            <Select 
                                                options={availableIndicatorsList}
                                            />
                                        </Form.Item>
                                    </Form>
                                    <LineChart 
                                        seriesData={chartData} 
                                        customOptions={customOptions}
                                    />
                                </>
                            )
                    : (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 400  
                            }}
                        >
                            Атрибут не выбран
                        </div>
                    )}
            </Card>
        </>
    )
}
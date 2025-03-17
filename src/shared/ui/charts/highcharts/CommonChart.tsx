/* eslint-disable react-hooks/exhaustive-deps */
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { useRef, useEffect } from 'react'
import { highchartsStaticsOptions } from './highchartsOptions'
import { IChartTypes, ISeriesOptions } from './types'
import moment from 'moment-timezone';
import HCNetworkgraphModule from 'highcharts/modules/networkgraph';
import HCTreeMapModule from 'highcharts/modules/treemap';
import HCWordCloudModule from 'highcharts/modules/wordcloud';
import HCSankeyModule from 'highcharts/modules/sankey';

import Indicators from 'highcharts/indicators/indicators'
import Bollinger from 'highcharts/indicators/bollinger-bands'
import AccelerationBands from 'highcharts/indicators/acceleration-bands'
import DEMA from 'highcharts/indicators/dema'
import EMA from 'highcharts/indicators/ema'
// import Ichimoku from 'highcharts/indicators/ichimoku-kinko-hyo'
import Atr from 'highcharts/indicators/atr'
import Regressions from 'highcharts/indicators/regressions'
import PivotPoints from 'highcharts/indicators/pivot-points'
import PriceChannel from 'highcharts/indicators/price-channel'
import PriceEnvelopes from 'highcharts/indicators/price-envelopes'
import SuperTrend from 'highcharts/indicators/supertrend'
import TEMA from 'highcharts/indicators/tema'
import Trendline from 'highcharts/indicators/tema'
import WMA from 'highcharts/indicators/wma'
import ZigZag from 'highcharts/indicators/zigzag'
// import HCBoost from 'highcharts/modules/boost';
// import HCExporting from 'highcharts/modules/exporting';
// import HCExportingData from 'highcharts/modules/export-data';
// import { chartConfig } from '@app/themes/forumTheme/forumThemeConfig'

Indicators(Highcharts)
Bollinger(Highcharts)
AccelerationBands(Highcharts)
DEMA(Highcharts)
EMA(Highcharts)
// Ichimoku(Highcharts)
Atr(Highcharts)
Regressions(Highcharts)
PivotPoints(Highcharts)
PriceChannel(Highcharts)
PriceEnvelopes(Highcharts)
SuperTrend(Highcharts)
TEMA(Highcharts)
Trendline(Highcharts)
WMA(Highcharts)
ZigZag(Highcharts)

HCNetworkgraphModule(Highcharts);
HCTreeMapModule(Highcharts);
HCWordCloudModule(Highcharts)
HCSankeyModule(Highcharts)
// HCBoost(Highcharts)
// HCExporting(Highcharts)
// HCExportingData(Highcharts)

type ISeriesData<T> = T | T[]
interface ICommonChart<T> {
    chartType: IChartTypes
    seriesData: ISeriesData<T>
    customOptions: Highcharts.Options
    settings?: any,
    defaultSettings?: {
        periodMnemo: string //Мнемоника периода по умолчанию
    }
    constructorType?: string
    commonSettings?: {
        height?: number
        width?: number
    }
}

export const rangeButtons: Highcharts.RangeSelectorButtonsOptions[] = [
    {
        type: 'hour',
        count: 1,
        text: '1ч',
    },
    {
        type: 'day',
        count: 1,
        text: '1д',
    },
    {
        type: 'day',
        count: 2,
        text: '2д',
    },
    {
        type: 'month',
        count: 1,
        text: '1мес',
    },
    {
        type: 'year',
        count: 1,
        text: '1г',
    },
    {
        type: 'all',
        text: 'все',
    },
]
// Базовые глобальные опции Highcharts для всех типов графиков - устанавливаются один раз при инициализации
Highcharts.setOptions({
    lang: {
        loading: 'Загрузка...',
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        weekdays: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        shortMonths: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.',
            'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
        rangeSelectorZoom: 'Период',
        rangeSelectorFrom: 'Период с',
        rangeSelectorTo: 'по',
        printChart: 'Печать графика',
        downloadPNG: 'Скачать PNG',
        downloadJPEG: 'Скачать JPEG',
        downloadPDF: 'Скачать PDF',
        downloadSVG: 'Скачать SVG',
        downloadCSV: 'Скачать CSV',
        downloadXLS: 'Скачать XLS',
        viewData: 'Показать таблицу данных',
        hideData: 'Скрыть таблицу данных',
        viewFullscreen: 'Полноэкранный режим',
        exitFullscreen: 'Выйти с полноэкранного режима'
    },
    time: {
        getTimezoneOffset: function(timestamp) {
            const zone = moment.tz.guess(true)
            const timezoneOffset = -moment.tz(timestamp, zone).utcOffset()

            return timezoneOffset;
        },
        useUTC: true,
    },
    rangeSelector: {
        buttons: rangeButtons
    },
    colors: [
        '#6929c4',
        '#1192e8',
        '#005d5d',
        '#9f1853',
        '#fa4d56',
        '#570408',
        '#198038',
        '#002d9c',
        '#ee538b',
        '#b28600',
        '#009d9a',
        '#012749',
        '#8a3800',
        '#a56eff',
    ],
})

const handleSHaxis = function(/* this: Highcharts.Series, event: Event */) {
    const oneOfSeriesIsVisible = this?.yAxis?.series.some(currSerie => currSerie?.visible)        
    
    // console.log('oneOfSeriesIsVisible', oneOfSeriesIsVisible)

    if (oneOfSeriesIsVisible !== this?.yAxis?.visible) {
        this?.yAxis?.update({
            visible: oneOfSeriesIsVisible
        })
    }
}

export const CommonChart: React.FC<ICommonChart<ISeriesOptions[IChartTypes]>> = ({
    chartType,
    seriesData,
    customOptions = {},
    constructorType = 'stockChart',
    commonSettings
    // defaultSettings
}) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    // const firstLoadRef = useRef(true)

    const staticOptions = highchartsStaticsOptions[chartType] ?? customOptions

    //TODO:: временный костыль на перерисовку чтобы нормально отображался период датами
    staticOptions.chart.events =  {
        ...staticOptions.chart.events,
        redraw: () => {
            if (chartRef.current) {
                const chart = chartRef.current?.chart

                if (chart && chart?.rangeSelector?.rendered) {
                    const inputDims = chart?.rangeSelector?.inputGroup

                    const buttons = chart?.rangeSelector?.buttons
                    const firstBtn = buttons?.at(0)

                    if (inputDims?.translateX - (firstBtn?.translateX + firstBtn?.width) < 50) {
                        chart?.rangeSelector?.inputGroup?.hide()
                    } else {
                        chart?.rangeSelector?.inputGroup?.show()
                    }
                }
            }
        },
        //render: () => { console.log('ARDEV render')},
        //load: () => { console.log('ARDEV load')},
        //load: function() { console.log('ARDEV load') }
    }

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current?.chart
            
            if (commonSettings?.height || commonSettings?.width) {
                // console.log('height', commonSettings?.height)
                chart.setSize(commonSettings?.width, commonSettings?.height)
            }
            chart?.update(customOptions, true, true)

            // Очистить серии перед добавлением новых серий, обязательно с конца массива
            // (массив шифтится после удаления каждой серии)
            if (chart?.series?.length > 0) {
                chart?.series?.reduceRight((acc, serie, idx) => {
                    chart?.series[idx]?.remove()

                    return acc
                }, {})
            }

            if (Array.isArray(seriesData)) {
                seriesData?.map((serie) => {
                    chart?.addSeries(serie)
                })
            } else {
                chart?.addSeries(seriesData)
            }

            // console.log('customOptions', customOptions)
            // console.log('chart.userOptions', chart.userOptions)

            if (chart && customOptions?.chart?.type === 'line') {
                chart.update({
                    plotOptions: {
                        line: {
                            events: {
                                show: handleSHaxis,
                                hide: handleSHaxis,
                            }
                        }
                    }
                }, true, true)
            }         

            // Отображение заданного интервала точек - периода по умолчанию (последний день)
            if (
                chart && 
                customOptions?.chart?.type === 'line' && 
                customOptions?.plotOptions?.line?.custom
            ) {
                const currentInterval = customOptions?.plotOptions?.line?.custom?.currentInterval
                const { startPoint, lastPoint } = currentInterval ?? {}

                chart?.xAxis?.[0]?.setExtremes(startPoint, lastPoint)
            }
            //Установка периода по умолчанию - эмуляция нажатия кнопки rangeSelector'а
            // if (chart && firstLoadRef?.current && chartConfig.currentZoomInterval) {
            //     firstLoadRef.current = false
            //     const periodButtons = chart.rangeSelector.buttons
            //     const twoDaysIndex = periodButtons
            //         .findIndex(button => button.textStr === chartConfig.currentZoomInterval)

            //     if (periodButtons?.[twoDaysIndex]) {
            //         chart.rangeSelector.buttons[twoDaysIndex].setState(2);
            //         chart.rangeSelector.clickButton(twoDaysIndex, true);
            //     }

            // }

            // скрытие инпутов rangeSelector'а при наложении кнопок на инпуты
            if (chart && chart?.rangeSelector?.rendered) {
                const inputDims = chart?.rangeSelector?.inputGroup

                const buttons = chart?.rangeSelector?.buttons
                const firstBtn = buttons?.at(0)

                // console.log('lastBtn', lastBtn)


                if (inputDims?.translateX - (firstBtn?.translateX + firstBtn?.width) < 100) {
                    chart?.rangeSelector?.inputGroup?.hide()
                } else {
                    chart?.rangeSelector?.inputGroup?.show()
                }
            }
        }
    }, [
        chartType,
        seriesData,
        customOptions,
        commonSettings?.height,
        commonSettings?.width,
    ])

    /* Поиск решения добавления серий через addPoints и 
        установки определенного зума отображения через ренджселектор */
    /* useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current?.chart
            
            // console.log('CommonChart options', customOptions)
            chart?.update(customOptions)

            // Очистить серии перед добавлением новых серий, обязательно с конца массива
            // (массив шифтится после удаления каждой серии)
            // if (chart?.series?.length > 0) {
            //     chart?.series?.reduceRight((acc, serie, idx) => {
            //         chart?.series[idx]?.remove()

            //         return acc
            //     }, {})
            // }

            if (Array.isArray(seriesData)) {
                seriesData?.map((serie, idx) => {
                    let newStart, newEnd, oldStart, oldEnd
                    const seriesIdx = chart?.series?.findIndex(s => s.name === serie.name)
                    
                    console.log('chart', chart)
                    console.log('chart.series', chart.series)
                    console.log('serie', serie)
                    console.log('seriesIdx', seriesIdx)

                    
                    if (
                        // chart?.options?.series &&
                        chart?.options?.series?.length > 0 &&
                        chart?.series?.[idx].data.length > 0 &&
                        serie?.data.length > 0
                    ) {
                        newStart = serie.data[0][0]
                        newEnd = serie.data.at(-1)[0]
                        oldStart = chart?.series?.[seriesIdx].data?.[0]?.category
                        oldEnd = chart?.series?.[seriesIdx].data.at(-1)?.category

                        // console.log('serie points', newStart, newEnd)
                        // console.log('chart?.series[idx]', chart?.options?.series?.[idx][idx])
                        // console.log('chart?.series points', oldStart, oldEnd)
                        serie.data.map(s => chart?.series?.[seriesIdx]?.addPoint(s, false, true))
                        // chart?.series[idx]?.remove()
                        // chart?.addSeries(serie) 
                    } else {
                        chart?.addSeries(serie) 
                    }

                    // chart?.addSeries(serie)

                    // chart?.series?.[idx].addPoint()
                })
            } else {

                // chart?.addSeries(seriesData)
            }
            const buttonIndex = chart?.rangeSelector?.buttons
                .findIndex(button => button.textStr === chartConfig.currentZoomInterval)
             

            // if (buttonIndex > -1) {
            //     chart?.update({
            //         rangeSelector: {
            //             selected: buttonIndex
            //         }
            //     })
            // }

            //Установка периода по умолчанию
            // if (chart && firstLoadRef?.current && chartConfig.currentZoomInterval) {
            //     firstLoadRef.current = false
            //     const periodButtons = chart.rangeSelector.buttons
            //     const twoDaysIndex = periodButtons
            //         .findIndex(button => button.textStr === chartConfig.currentZoomInterval)

            //     if (periodButtons?.[twoDaysIndex]) {
            //         chart.rangeSelector.buttons[twoDaysIndex].setState(2);
            //         chart.rangeSelector.clickButton(twoDaysIndex, true);
            //     }

            
        
    }, [
        chartType,
        seriesData,
        customOptions
    ]) } */

    return (
        <HighchartsReact
            ref={chartRef}
            constructorType={constructorType}
            highcharts={Highcharts}
            options={staticOptions}
            style={{ width: '100%', height: 'auto' }}
        />
    );
}
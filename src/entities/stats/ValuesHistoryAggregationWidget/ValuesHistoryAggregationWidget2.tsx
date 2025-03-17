import HighchartsReact from 'highcharts-react-official';
import HighchartsHighStock from 'highcharts/highstock';
import { useEffect, useState } from 'react';
import { chartsKeys, dataSources2, groupKeys, viewKeys } from './prepare';
import { useDefaultChartOptions } from './useDefaultOptions';
import { validateTimestamps } from './validateTimestamps';
import { createSeriesForMetricPoints } from './createSeriesForMetricPoints';
import { createPointsForTimeline } from './createPointsForTimeline';
import { createPieChartData } from './createPieChartData';
import { mixWithHistoryWidgetOptions } from './mixWithHistoryOptions';
import { findMaxPointY } from './findMaxPointY';
import { yAxisLabelFormatter } from './yAxisLabelFormatter';
import { createOptionsForOnlyActiveStatuses } from './createOptionsOnlyActiveStatuses';
import { createOptionsForGroupingByDate } from './createOptionsForGroupingByDate';
import { createOptionForLastPointColumnChart } from './createOptionsForLastPointColumnChart';
import { createOptionsForPercentageChart } from './createOptionsForPercentageChart';
import { useAutoUpdate } from './hooks/useAutoUpdate';
import MetricDataCard from './components/MetricDataCard';
import HorizontalTimeBarChart from './components/HorizontalTimeBarChart';
import { PieChartWrapper } from '@shared/ui/charts/highcharts/wrappers';
import { ICheckNetChartPayload, IStatsProps } from '@shared/types/stats';
import { convertRawSeriesForHighchart2 } from './convertRawSeriesForHighchart2';
import { createPayload2 } from './createPayload2';
import { getCheckNetChart } from '@shared/api/Stats/Models/getCheckNetChart';
import { getUserActivity } from '@shared/api/Stats/Models/getUserActivity';

export interface LegendValues {
    activeLegend: boolean
    orientationLegend: string
    legendUnits: string
    legendTypeValues: 'absolute' | 'percentage' | 'both'
    activeLabelLegend: boolean
    legendWidth: string
    locationLegend: string
}

HighchartsHighStock.setOptions({
    time: {
        timezoneOffset: new Date().getTimezoneOffset()
    }
})

export interface IValuesHistoryAggregationProps extends Omit<IStatsProps, 'attributeId'> {
    attributeId: { rcv: number, trn: number }
    bounds?: [number, number] | never[]
    groupBy?: keyof typeof groupKeys
    dataSource: keyof typeof dataSources2
    chart?: Partial<{ 
        name: string,
        type: keyof typeof chartsKeys, 
        view: keyof typeof viewKeys
        autoUpdated: boolean
    }>
    legend?: Partial<{
        valuesType: 'absolute' | 'percentage' | 'both'
    }>
}

interface PieChartComponent {
    data: {
        color: string,
        name: string,
        nameGraph: string,
        y: number
    }[],
    legend?: string, // Позиционирование легенды
    legendUnits?: string,
    legendTypeValues?: 'absolute' | 'percentage' | 'both'
    activeLabelLegend?: boolean // Показывать название в легенде
    activeLegend?: boolean // Показывать легенду
    type?: 'percentage' | 'names'
    ticketLegend?: boolean,
    orientationLegend?: string,
    legendWidth?: number
}

export interface IPieChart extends PieChartComponent { }

export type TGetStatsApiFunction = {
    name?: string
    color?: any // todo: typing!
    data: [number, number][]
    code?: string
}

const ValuesHistoryAggregationWidget2: React.FC<IValuesHistoryAggregationProps> = (props) => {
    const { source, chart, legend, dataSource } = props

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ error, setError ] = useState('')
    const [ timelineData, setTimelineData ] = useState<any[]>([])
    const [ loading, setLoading ] = useState(false)
    const [ localOptions, setLocalOptions ] = useDefaultChartOptions({ 
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                minPointLength: 4,
                //maxPointWidth: 30
            }
        },
        rangeSelector: {
            buttons: []
        },
        series: []
    })

    const [ pieChartData, setPieChartData ] = useState<IPieChart['data']>([])

    const requestData = async () => {
        const payload: Partial<ICheckNetChartPayload> = JSON.parse(JSON.stringify(createPayload2(props)))

        if (!payload) {
            return
        }

        if (!source) {
            // todo: отобразить ошибку, которая будет отображаться на графике
            setError('')

            return
        }

        try {
            setLoading(true)
            setError('')

            const func = (response: any) => {
                if (!response.data || !response.success) {
                    setError('Не определены данные для отображения')
    
                    return
                }
    
                // проверяем валидность таймстемпов
                if (!validateTimestamps(response.data)) {
                    setError('Некорректные значения временных меток')
    
                    return
                }
    
                // todo: пересмотреть функцию, когда metric-points будут присылать name в ответе
                const tmpSeries = createSeriesForMetricPoints(response.data)
    
                if (chart?.view === 'timeline') {
                    setTimelineData([{
                        title: '',
                        data: createPointsForTimeline(tmpSeries)
                    }])
    
                    return
                }
                
                const modifiedSeries = convertRawSeriesForHighchart2(tmpSeries, props)

                if (chart?.view === 'lastPie') {
                    setPieChartData(createPieChartData(modifiedSeries))
    
                    return
                }
    
                // выводятся все пришедшие серии
                setLocalOptions(o => ({ 
                    ...o, 
                    ...mixWithHistoryWidgetOptions(localOptions),
                    //сортируем массивы по максимальным значениям
                    series: modifiedSeries,
                    yAxis: {
                        ...o.yAxis,
                        max: findMaxPointY(modifiedSeries),
                        labels: {
                            ...o.yAxis?.labels,
                            distance: 0,
                            y: 4,
                            formatter: function() {
                                return yAxisLabelFormatter.call(this)
                            }
                        }
                    }
                    // todo: typing
                }) as any)
    
                // выводятся только ненулевые серии
                if (chart?.type === 'active') {
                    setLocalOptions(o => createOptionsForOnlyActiveStatuses(o, modifiedSeries))
                }
    
                // Подпись без времени, если группировка по дням (тултип только дата)
                setLocalOptions(o => createOptionsForGroupingByDate(o, props))
    
                if (chart?.type === 'percents' || chart?.type === 'absolute') {
                    setLocalOptions(o => ({ ...o,
                        plotOptions: {
                            ...o.plotOptions,
                            series: {
                                ...o.plotOptions?.series,
                                minPointLength: 0
                            }
                        }
                    }))
                }
    
                if (chart?.view === 'lastColumn') {
                    setLocalOptions(createOptionForLastPointColumnChart)
                }
    
                // todo: исправить сравнение
                if (dataSource === 'userActivity') {
                    setLocalOptions(o => ({ 
                        ...o, 
                        series: o.series.filter((s) => (s as any)?.code != '0')
                    }))
                }
    
                if (legend?.valuesType === 'percentage') {
                    setLocalOptions(createOptionsForPercentageChart) 
                }
            }

            switch (dataSource) {
                case 'checkNetChart': {
                    func((await getCheckNetChart(payload)))
                    break
                }
                case 'userActivity': {
                    // todo: типизация payload для доcтупного источника данных
                    func((await getUserActivity(payload as any)))
                    break
                }
                default: {
                    throw new Error('Не указан источник данных')
                }
            }
        } catch (err) {
            console.error('response error')
            setError(err?.message || 'response error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        requestData()
    }, [props])

    useAutoUpdate(requestData, 60_000, chart?.autoUpdated)

    return (
        <>
            {chart?.view !== 'lastPie' && chart?.view !== 'lastColumn' && (
                <MetricDataCard
                    title={loading ? 'Загрузка данных... ' : chart?.name || ''}
                    color="#F4F4F4"
                    titleColor="black"
                >
                    {chart?.view === 'column' && (
                        <HighchartsReact
                            constructorType="stockChart"
                            highcharts={HighchartsHighStock}
                            options={localOptions}
                        />
                    )}
                    {chart?.view === 'timeline' && (
                        <HorizontalTimeBarChart
                            data={timelineData}
                            zoomEnabled={false}
                        />
                    )}
                </MetricDataCard>
            )}
            {(chart?.view === 'lastPie' && (
                <PieChartWrapper 
                    data={pieChartData.map((point) => ({
                        value: point.name,
                        count: point.y,
                        color: point.color
                    }))}                
                />
            ))}
            {(chart?.view === 'lastColumn' && (
                <HighchartsReact
                    constructorType="stockChart"
                    highcharts={HighchartsHighStock}
                    options={localOptions}
                />
            ))}
        </>
    );
}

export default ValuesHistoryAggregationWidget2
import HighchartsReact from 'highcharts-react-official';
import HighchartsHighStock from 'highcharts/highstock';
import { useState } from 'react';
import { aggregationKeys, chartsKeys, groupKeys, viewKeys } from './prepare';
import { useDefaultChartOptions } from './useDefaultOptions';
import { validateTimestamps } from './validateTimestamps';
import { createSeriesForMetricPoints } from './createSeriesForMetricPoints';
import { createPointsForTimeline } from './createPointsForTimeline';
import { convertRawSeriesForHighchart } from './convertRawSeriesForHighchart';
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
import { IRelation } from '@shared/types/relations';
import { IClass } from '@shared/types/classes';
import { IAttribute } from '@shared/types/attributes';
import { createApiRequest } from '@entities/stats/ValuesHistoryAggregationWidget/createApiRequest';

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

export type TValuesHistoryAggregationWidgetProps = TValuesHistoryAggregationFields
    & Partial<LegendValues>
    & { fakeResponse?: any }

export type TValuesHistoryAggregationFields = Partial<{
    dataSource: number,
    subjectChildTypes: number[],
    groupBy: keyof typeof groupKeys
    aggregationType: keyof typeof aggregationKeys,
    depth: number[],
    chartType: keyof typeof chartsKeys,
    chartName: string
    view: keyof typeof viewKeys
    autoUpdated: boolean,

    //ML
    source_class_id: IClass['id'],
    target_class_id: IClass['id'],
    relation_ids: IRelation['id'][]
    rcv_attribute_id: IAttribute['id'],
    source: 'class' | 'attribute',
    values_post_regexp: string,
    trn_attribute_id: IAttribute['id'],
}>

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

const ValuesHistoryAggregationWidget: React.FC<TValuesHistoryAggregationWidgetProps> = (props) => {
    const {
        dataSource,
        chartType,
        chartName,
        view,
        autoUpdated,
        legendTypeValues,
        fakeResponse
    } = props

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

        const apiRequestData = createApiRequest(props)
    
        //Обрабатываем ошибку
        if (!apiRequestData.success || apiRequestData.source == undefined) {
            setError(apiRequestData?.error ?? 'Неверные параметры виджета')

            return
        }
        setLoading(true)

        const response = (fakeResponse) ?? await apiRequestData.source.apiFunction({ ...apiRequestData.payload });

        //const response = fakeResponse
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

        if (view === 'timeline') {
            setTimelineData([{
                title: '',
                data: createPointsForTimeline(tmpSeries)
            }])

            return
        }

        const modifiedSeries = convertRawSeriesForHighchart(tmpSeries, props)

        if (view === 'lastPie') {
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
        if (chartType === 'active') {
            setLocalOptions(o => createOptionsForOnlyActiveStatuses(o, modifiedSeries))
        }

        // Подпись без времени, если группировка по дням (тултип только дата)
        setLocalOptions(o => createOptionsForGroupingByDate(o, props))

        if (chartType === 'percents' || chartType === 'absolute') {
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

        if (view === 'lastColumn') {
            setLocalOptions(createOptionForLastPointColumnChart)
        }

        if (dataSource === 4) {
            setLocalOptions(o => ({
                ...o,
                series: o.series.filter((s) => (s as any)?.code != '0')
            }))
        }

        if (legendTypeValues === 'percentage') {
            setLocalOptions(createOptionsForPercentageChart)
        }

        setLoading(false)
        setError('')

    }

    useAutoUpdate(requestData, 60_000, autoUpdated)

    return (
        <>
            {view !== 'lastPie' && view !== 'lastColumn' && (
                <MetricDataCard
                    title={loading ? 'Загрузка данных... ' : chartName || ''}
                    // buttons={
                    //     <ChartToolbarButtons info={{ modalContent: 'modal' }} />
                    // }
                    color="#F4F4F4"
                    titleColor="black"
                >
                    {view === 'column' && (
                        <HighchartsReact
                            constructorType="stockChart"
                            highcharts={HighchartsHighStock}
                            options={localOptions}
                            containerProps={{
                                style: {
                                    //borderRadius: `0 0 ${radius} ${radius}`,
                                },
                            }}
                        />
                    )}
                    {view === 'timeline' && (
                        <HorizontalTimeBarChart
                            data={timelineData}
                            zoomEnabled={false}
                        />
                    )}
                </MetricDataCard>
            )}
            {(view === 'lastPie' && (
                <PieChartWrapper
                    data={pieChartData.map((point) => ({
                        value: point.name,
                        count: point.y,
                        color: point.color
                    }))}
                />
            ))}
            {(view === 'lastColumn' && (
                <HighchartsReact
                    constructorType="stockChart"
                    highcharts={HighchartsHighStock}
                    options={localOptions}
                    containerProps={{
                        style: {
                            //borderRadius: `0 0 ${radius} ${radius}`,
                        },
                    }}
                />
            ))}
        </>
    );
}

export default ValuesHistoryAggregationWidget
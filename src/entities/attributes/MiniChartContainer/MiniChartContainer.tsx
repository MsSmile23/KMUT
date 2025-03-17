import { IObjectAttribute } from '@shared/types/objects'
import { ECAreaChart } from '@shared/ui/ECUIKit/charts/ECAreaChart/ECAreaChart'
import { FC, useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import { SERVICES_ATTRIBUTE_HISTORY } from '@shared/api/AttributeHistory'
import { useInterval } from '@shared/hooks/useInterval'
import { IRepresentationProps } from '@containers/widgets/WidgetObjectOAttrsWithHistory/ObjectOAttrsWithHistoryForm'
import { ECLoader } from '@shared/ui/loadings'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

type TLoadingStatus = 'idle' | 'loading' | 'finished'

export interface IMiniChartContainerProps {
    hasLabels?: boolean
    objectAttribute: IObjectAttribute
    autoUpdate?: {
        enabled: boolean
        time: number
    }
    miniChartProps?: IRepresentationProps['miniChart']
    limit?: number
}

const defaultMiniChartOptions: Highcharts.Options = {
    chart: {
        type: 'area',
        animation: false,
        zooming: {
            mouseWheel: {
                enabled: false,
            },
        },
    },
    plotOptions: {
        area: {
            animation: false,
        },
    },
    title: {
        text: '',
    },
    tooltip: {
        enabled: false,
    },
    navigator: {
        enabled: false,
        outlineWidth: 0,
    },
    rangeSelector: {
        enabled: false,
    },
    series: [],
}

export const MiniChartContainer: FC<IMiniChartContainerProps> = ({
    hasLabels = false,
    objectAttribute,
    autoUpdate = {
        enabled: true,
        time: 600_000,
    },
    miniChartProps,
    limit,
}) => {
    const [chartData, setChartData] = useState<Highcharts.SeriesAreaOptions[]>([])
    const [status, setStatus] = useState<TLoadingStatus>('idle')
    const [dateIntervals, setDateIntervals] = useState<[string, string]>([null, null])

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : '#ffffff'

    useInterval(
        () => {
            if (objectAttribute) {
                getChartData(objectAttribute).then()
            }
        },
        autoUpdate && autoUpdate.enabled ? autoUpdate.time : null
    )

    useEffect(() => {
        if (objectAttribute) {
            getChartData(objectAttribute).then()
        }
    }, [objectAttribute, dateIntervals[0], dateIntervals[1], textColor])

    const [options, setOptions] = useState<Highcharts.Options>({
        ...defaultMiniChartOptions,
        chart: {
            ...defaultMiniChartOptions.chart,
            height: miniChartProps?.height,
        },
        navigator: {
            ...defaultMiniChartOptions.navigator,
            xAxis: {
                labels: {
                    style: {
                        color: textColor || 'black',
                    },
                },
            },
        },
    })

    function addLastPointLabel(chart, label: string) {
        if (['area'].includes(chart.options.chart.type)) {
            if (chart.customTitle) {
                chart.customTitle.destroy()
            }

            if (chart?.series.length > 0) {
                const centerX = chart.containerBox.width / 2
                // const centerX = chart.plotWidth / 2
                const centerY = chart.containerBox.height / 2
                // const centerY = chart.plotHeight / 2

                chart.customTitle = chart?.renderer
                    ?.text(label, centerX, centerY, false)
                    .css({
                        fontSize: miniChartProps?.fontSize || '1em',
                        color: Highcharts.getOptions().colors[0],
                        // color: '#000000',
                        fontWeight: 'bold',
                    })
                    .add()

                const fontMetrics = chart.renderer.fontMetrics(chart.customTitle)
                const customTitleSizes = chart.customTitle.getBBox()

                chart.customTitle.attr({
                    x: centerX - customTitleSizes.width / 2,
                    y: centerY + fontMetrics.f / 2,
                    zIndex: 6,
                })
            }
        }
    }

    const limitPayload = limit ? { limit } : {}

    const getChartData = async (attr: IObjectAttribute) => {
        setStatus('loading')
        // console.log('attr', attr)
        const response = await SERVICES_ATTRIBUTE_HISTORY.Models.getAttributeHistoryById({
            id: attr.id,
            start: dateIntervals[0],
            end: dateIntervals[1],
            ...limitPayload,
        })
        let lastPoint: string

        if (response.success) {
            if (response?.data) {
                let currentSerieName = ''
                const series: Highcharts.SeriesAreaOptions[] = response?.data?.series.map((serie) => {
                    currentSerieName = serie.name
                    const points = serie?.data
                        .map((item) => {
                            const msTimeStamp = item[0] * 1000

                            const point = [
                                msTimeStamp,
                                typeof item[1] == 'string' ? parseFloat(item[1] as string) : item[1],
                            ]

                            return point as [number, number]
                        })
                        .sort((a, b) => a[0] - b[0])

                    // lastPoint = `${points.at(-1)[1]} ${serie.unit ?? ''}`

                    const params = objectAttribute?.attribute?.view_type?.params
                    const currentValue = points.at(-1)[1]
                    // Если есть params, то парсим value_converter
                    const value_converter = params && JSON.parse(params)?.value_converter
                    // Если value_converter есть, то ищем конкретный source
                    const currentSource = value_converter?.find((item) => item.source == currentValue)
                    // Присваиваем текущее значения в зависимости от наличия value_converter у неё
                    const parsedCurrentValue = value_converter
                        ? currentSource?.converted ?? ''
                        : Math.round(currentValue * 100) / 100

                    // console.log('value_converter', attr?.id, value_converter)
                    // console.log('serie.unit', attr?.id, serie.unit)
                    // console.log('parsedCurrentValue', attr?.id, parsedCurrentValue)

                    lastPoint = `${parsedCurrentValue} ${serie.unit ?? ''}`

                    return {
                        type: 'area',
                        name: serie.name ?? response?.data?.name ?? '',
                        data: points,
                        states: {
                            hover: {
                                enabled: false,
                            },
                        },
                    } as Highcharts.SeriesAreaOptions
                })

                setChartData(series)
                setOptions(
                    (prevOptions) =>
                        ({
                            ...prevOptions,
                            chart: {
                                ...prevOptions.chart,
                                events: {
                                    ...prevOptions.chart.events,
                                    render: function() {
                                        addLastPointLabel(this, lastPoint)
                                    },
                                },
                            },
                            title: {
                                text: miniChartProps?.showTitle ? currentSerieName ?? response?.data?.name ?? '' : '',
                                style: {
                                    fontSize: 14,
                                    color: textColor,
                                },
                            },
                            plotOptions: {
                                series: {
                                    animation: false,
                                },
                                area: {
                                    // Получить набор рулсов и взять цвет lastPoint значения оттуда и вставить сюда
                                    color: `${Highcharts.getOptions().colors[0]}50`,
                                    /* если нужен градиент, то вставить свой цвет в stops*/

                                    // fillColor: {
                                    //     linearGradient: {
                                    //         x1: 0,
                                    //         x2: 0,
                                    //         y1: 0,
                                    //         y2: 1
                                    //     },
                                    //     stops: [
                                    //         [0, `${Highcharts.getOptions().colors[0]}`],
                                    //         [1, 'rgba(255, 255, 255, 0.5)']
                                    //     ]
                                    // }
                                },
                            },
                            xAxis: [
                                {
                                    labels: {
                                        enabled: false,
                                    },
                                    lineWidth: 0,
                                    tickWidth: 0,
                                    gridLineWidth: 0,
                                    title: {
                                        text: null,
                                    },
                                    crosshair: false,
                                    visible: false,
                                },
                            ],
                            yAxis: [
                                {
                                    labels: {
                                        enabled: false,
                                    },
                                    lineWidth: 0,
                                    tickWidth: 0,
                                    gridLineWidth: 0,
                                    title: {
                                        text: null,
                                    },
                                    visible: false,
                                },
                            ],
                        } as Highcharts.Options)
                )
            }
        }
        setStatus('finished')
    }

    useEffect(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            chart: {
                ...prevOptions.chart,
                height: miniChartProps?.height,
                backgroundColor: backgroundColor ?? '#ffffff',
            },
            title: {
                ...prevOptions.title,
                style: {
                    fontSize: 14,
                    color: textColor ?? '#000000',
                },
            },
        }))
    }, [hasLabels, miniChartProps?.height, textColor, backgroundColor])

    return ['idle', 'loading'].includes(status) ? (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: miniChartProps.height,
            }}
        >
            <ECLoader />
        </div>
    ) : chartData.length > 0 ? (
        <ECAreaChart seriesData={chartData} customOptions={options} />
    ) : (
        <div>No data</div>
    )
}
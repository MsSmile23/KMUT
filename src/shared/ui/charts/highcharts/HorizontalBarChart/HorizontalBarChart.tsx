import HighchartsReact, { HighchartsReactProps } from 'highcharts-react-official'
import { FC, useEffect, useRef } from 'react'
import Highcharts from 'highcharts/highstock'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'
// import { merge } from 'lodash';

type TChartOptions = HighchartsReactProps['options']
type TSeries = TChartOptions['series']

interface Props {
    customOptions?: Omit<TChartOptions, 'series'>
    data: TSeries
}

export const HorizontalBarChart: FC<Props> = ({ customOptions, data }) => {
    // const mergedOptions = merge(options, customOptions)

    // const mergedOptionsWithData = merge(mergedOptions, { series: data })
    const chartRef = useRef<HighchartsReact.RefObject>(null)
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
        : '#ffffff'

    const options: TChartOptions = {
        chart: {
            type: 'bar',
            backgroundColor: backgroundColor,
        },
        title: {
            text: null,
        },
        credits: {
            enabled: false,
        },
        navigator: {
            enabled: false,
        },
        rangeSelector: {
            enabled: false,
        },
        plotOptions: {
            series: {
                stacking: 'normal',
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: null,
            },
            labels: {
                style: {
                    color: textColor,
                },
            },
        },
        xAxis: {
            labels: {
                style: {
                    color: textColor,
                },
            },
        },
        legend: {
            itemStyle: { color: textColor },
        },
    }

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current?.chart

            chart?.update(customOptions)

            // // Очистить серии перед добавлением новых серий, обязательно с конца массива
            // (массив шифтится после удаления каждой серии)
            if (chart?.series?.length > 0) {
                chart?.series?.reduceRight((acc, serie, idx) => {
                    chart?.series[idx]?.remove()

                    return acc
                }, {})
            }

            if (Array.isArray(data)) {
                data?.map((serie) => {
                    chart?.addSeries(serie)
                })
            } else {
                chart?.addSeries(data)
            }
        }
    }, [data, customOptions])

    return (
        <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={options}
            // options={mergedOptionsWithData}
            style={{ width: '100%', height: 'auto' }}
        />
    )
}
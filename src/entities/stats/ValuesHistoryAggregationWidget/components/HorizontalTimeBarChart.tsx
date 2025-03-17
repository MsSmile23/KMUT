import Highcharts from 'highcharts/highcharts-gantt'
import HighchartsReact from 'highcharts-react-official'
import { FC, useEffect, useState } from 'react'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

Highcharts.setOptions({
    lang: {
        months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ],
        weekdays: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        shortMonths: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
    },
    time: {
        timezoneOffset: -180,
    },
})

const base = {
    credits: {
        enabled: false,
    },
    rangeSelector: {
        enabled: false,
    },
    navigator: {
        height: 30,
        enabled: true,
        margin: 2,
    },
    chart: {
        type: 'xrange',
        height: 180,
    },
    title: {
        style: {
            display: 'none',
        },
    },
    tooltip: {
        useHTML: true,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
        headerFormat: `
            <span 
                style="font-size: 14px; font-weight: 600"
            >
                {point.x} - {point.x2}
            </span>
            <br/>
        `,
        pointFormat: `
            <div style="display: flex; align-items: center; gap: 5px">
                <div 
                    style="
                        width: 10px; 
                        height: 10px; 
                        border-radius: 50%; 
                        background: {point.color}
                    "
                ></div>
                <div style="font-size: 16px">{point.title}</div>
            </div>
        `,
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 1000 * 60 * 60 * 12,
        visible: false,
        minRange: 60 * 1000,
    },
    yAxis: {
        visible: false,
        title: {
            text: '',
        },
        categories: ['Статус'],
        reversed: true,
    },
}

const modifyChartHeight = (base: Record<string, any>, data: any[], backgroundColor: string) => {
    return data?.length < 2
        ? {
            ...base,
            chart: {
                ...base.chart,
                backgroundColor: backgroundColor,
            },
        }
        : {
            ...base,
            chart: {
                ...base.chart,
                height: 250 + (data?.length || 0) * 50,
                backgroundColor: backgroundColor,
            },
        }
}

const prepareData = (bars: any[]) => {
    return {
        series: (bars || []).map((bar) => {
            return {
                groupPadding: 0.85,
                dataLabels: {
                    enabled: true,
                },
                turboThreshold: 0,
                borderColor: 'rgba(0,0,0,0)',
                borderRadius: 0,
                pointWidth: 75,
                name: bar.title,
                data: bar?.data?.map((barPart) => {
                    return {
                        color: barPart.color || 'silver',
                        x: new Date(barPart.start_dt).getTime(),
                        x2: new Date(barPart.end_dt).getTime(),
                        partialFill: 0,
                        y: 0,
                        title: barPart.title,
                    }
                }),
            }
        }),
    }
}

const HorizontalTimeBarChart: FC<{
    data: any[]
    zoomEnabled?: boolean
}> = ({ data, zoomEnabled = true }) => {
    //const theme = useContext(PreloadTheme)
    //const radius = theme.chartStyles.general.borderRadius.inner

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) ?? '#ffffff'
        : '#ffffff'
    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) ?? '#ffffff'
        : '#ffffff'

    const [chartOptions, setChartOptions] = useState({
        ...modifyChartHeight(base, data, backgroundColor),
        ...prepareData(data),
        navigator: {
            enabled: zoomEnabled,
            margin: 2,
            xAxis: {
                labels: {
                    style: {
                        color: textColor || 'black',
                    },
                },
            },
        },
        rangeSelector: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
    })

    useEffect(() => {
        setChartOptions({
            ...modifyChartHeight(base, data, backgroundColor),
            ...prepareData(data),
            navigator: {
                enabled: zoomEnabled,
                margin: 2,
                height: 15,
                xAxis: {
                    labels: {
                        style: {
                            color: textColor || 'black',
                        },
                    },
                },
            } as any,
            rangeSelector: {
                enabled: false,
            },
            legend: {
                enabled: false,
            },
        })
    }, [data, zoomEnabled, theme, themeMode])

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            containerProps={{
                style: {
                    width: '100%',
                    //borderRadius: `0 0 ${radius} ${radius}`
                },
            }}
        />
    )
}

export default HorizontalTimeBarChart
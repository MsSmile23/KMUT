import { FC, useEffect, useRef, useState } from 'react'
import { TECScatterPlotChart } from './types'
import { CommonChart } from '@shared/ui/charts/highcharts/CommonChart'
import { IChartTypes } from '@shared/ui/charts/highcharts/types'
import Highcharts from 'highcharts/highstock'
import { getUTCTodayStartAndEndOfDay, getAndPrepareDataForScatterChart } from './utils'
import { jsonParseAsObject } from '@shared/utils/common'
import { Spin } from 'antd'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

const dateUTCStartAndEnd = getUTCTodayStartAndEndOfDay()

type TContent = {
    children: string | JSX.Element | JSX.Element[]
}

const Content: FC<TContent> = ({ children }) => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    )
}

export const ECScatterPlotChart: FC<TECScatterPlotChart> = ({
    data,
    height,
    width,
    limit,
    vtemplateType,
    builderView,
}) => {
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const chartContainerRef = useRef(null)

    const [preparedData, setPreparedData] = useState(null)

    useEffect(() => {
        if (vtemplateType === 'mockData' && builderView) {
            return setPreparedData('NotData')
        }
        getAndPrepareDataForScatterChart(data, limit).then((currentData) => {
            setPreparedData(currentData)
        })
    }, [data])

    //Все настройки чарта
    const defaultOptions = {
        time: {
            useUTC: true,
        },
        chart: {
            type: 'scatter',
            zoomType: 'x',
            animation: false,
            resetZoomButton: {
                theme: { style: { display: 'none' } },
            },
            zooming: {
                mouseWheel: {
                    enabled: false,
                },
            },
            backgroundColor: backgroundColor,
        },
        title: {
            text: '',
            style: {
                color: textColor,
            },
        },
        subtitle: {
            text: '',
            style: {
                color: textColor,
            },
        },
        credits: {
            enabled: false,
        },
        xAxis: {
            tickInterval: 3600 * 1000,
            min: dateUTCStartAndEnd.start,
            max: dateUTCStartAndEnd.end,
            labels: {
                formatter: function() {
                    return Highcharts.dateFormat('%H:%M', this.value)
                },
                style: {
                    color: textColor,
                },
            },
        },
        plotOptions: {
            series: {
                clip: true,
                animation: false,
                stickyTracking: false,
                states: {
                    inactive: {
                        opacity: 1,
                    },
                },
                showInNavigator: false,
            },
            scatter: {
                jitter: {
                    x: 5,
                    y: 0,
                },
                states: {
                    hover: {
                        animation: false,
                    },
                },
            },
        },
        navigator: {
            enabled: true,
            adaptToUpdatedData: false,
            time: {
                useUTC: false,
            },
            xAxis: {
                tickInterval: 1 * 3600 * 1000,
                min: dateUTCStartAndEnd.start,
                max: dateUTCStartAndEnd.end,
                labels: {
                    formatter: function() {
                        return Highcharts.dateFormat('%H:%M', this.value)
                    },
                    style: {
                        color: textColor || 'black',
                    },
                },
            },
            height: 20,
        },
        tooltip: {
            enabled: true,
            formatter: function() {
                return `
                <b>${Highcharts.dateFormat('%e.%m.%Y %H:%M', preparedData.oldData[this.point.index])}</b></br>
                <span style="color:${this.color}">
                ${this.series.name} [${Math.floor(this.y)} ${data[0]?.attribute?.unit}]
                </span>
                `
            },
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    color: textColor,
                },
            },
            min: jsonParseAsObject(data[0]?.attribute?.viewType).min || 0,
            max: jsonParseAsObject(data[0]?.attribute?.viewType).max || 100,
            labels: {
                formatter: function() {
                    return `${this.value} ${data[0]?.attribute?.unit}`
                },
                style: {
                    color: textColor,
                },
            },
        },
        legend: {
            itemStyle: {
                color: textColor,
            },
            itemHoverStyle: {
                color: textColor,
            },
        },
    }

    //Начальная загрузка
    if (preparedData === null) {
        return (
            <Content>
                <Spin />
            </Content>
        )
    }

    if (preparedData === 'NotData') {
        return <Content>Нет данных для отображения</Content>
    }

    //Если нет данных
    if (preparedData?.seriesData?.length < 1 && preparedData?.oldData?.length < 1) {
        return <Content>Нет данных</Content>
    }

    //Если есть данные
    return (
        <div style={{ width: '100%', height: '100%' }} ref={chartContainerRef}>
            <CommonChart
                chartType={IChartTypes.SCATTER_PLOT}
                seriesData={preparedData?.seriesData || []}
                constructorType="chart"
                customOptions={defaultOptions}
            />
        </div>
    )
}
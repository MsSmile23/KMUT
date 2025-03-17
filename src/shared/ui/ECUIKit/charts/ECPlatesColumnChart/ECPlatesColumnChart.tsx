import { FC, useRef, useEffect, useState } from 'react'
import { TECPlatesColumnChart } from './types'
import { CommonChart } from '@shared/ui/charts/highcharts/CommonChart'
import { IChartTypes } from '@shared/ui/charts/highcharts/types'
import { prepareData } from './utils'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export const ECPlatesColumnChart: FC<TECPlatesColumnChart> = ({
    data,
    height,
    width,
    pointWidth = 60,
    inverted = false,
    fontSize = 12,
    onlyActiveColor = true,
}) => {
    const chartContainerRef = useRef(null)

    const { seriesData, categories, colors } = prepareData(data || [], onlyActiveColor)

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : '#ffffff'

    const defaultOptions: Highcharts.Options = {
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
        navigator: {
            enabled: false,
        },
        rangeSelector: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
        },
        title: null,
        plotOptions: {
            series: {
                animation: false,
            },
            column: {
                stacking: 'normal',
                groupPadding: 20,
                pointWidth: pointWidth,
                centerInCategory: false,
                states: {
                    hover: {
                        animation: false,
                        enabled: false,
                        opacity: 1,
                    },
                    inactive: {
                        enabled: false,
                    },
                },
            },
        },
    }

    const customOptions = {
        chart: {
            backgroundColor: backgroundColor ?? '#ffffff',
            width: width || null,
            height: height || null,
            padding: 0,
            animation: false,
            type: 'column',
            title: {
                text: '',
            },
            inverted: inverted || false,
            zooming: {
                mouseWheel: {
                    enabled: false,
                },
            },
            style: {
                overflow: 'allow',
            },
        },
        xAxis: {
            categories: categories || [],
            visible: true,
            lineWidth: 0,
            reversed: false,
            labels: {
                style: {
                    color: textColor ?? '#000000',
                },
            },
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: null,
            },
            legend: {
                visible: false,
                enabled: false,
            },
            dataLabels: {
                visible: false,
            },
            labels: {
                enabled: false,
            },
            stackLabels: {
                formatter: function() {
                    const map2 = data.flatMap(({ data }) => [data[0].value])

                    if (map2[this.x] == null || String(map2[this.x]) == '') {
                        return `${map2[this.x]}${'Нет измерений'}`
                    }

                    // eslint-disable-next-line max-len
                    return `<span style="color:${
                        colors[this.x]
                    };font-size:${fontSize}px;line-height:${fontSize}px;margin-left: 8px;">${map2[this.x]} ${
                        data[0].unit || ''
                    }</span>`
                },
                visible: true,
                enabled: true,
                style: {
                    textOutline: 'none',
                },
                border: 0,
                useHTML: true,
            },
            visible: true,
        },
    }

    // useEffect(() => {
    //     const container = chartContainerRef.current;

    //     if (container && container !== null) {
    //         let timeoutId;

    //         const handleResize = () => {
    //             clearTimeout(timeoutId);
    //             timeoutId = setTimeout(() => {
    //                 const containerWidth = container.getBoundingClientRect().height;

    //                 setPointHeight(containerWidth);
    //             }, 250);
    //         };

    //         window.addEventListener('resize', handleResize);
    //         handleResize();

    //         return () => window.removeEventListener('resize', handleResize);
    //     }
    // }, []);

    const combineDefaultAndCustomOptions = { ...defaultOptions, ...customOptions }

    return (
        <div style={{ width: '100%', height: '100%' }} ref={chartContainerRef}>
            <CommonChart
                chartType={IChartTypes.PLATESCOLUMN}
                seriesData={seriesData || []}
                constructorType="chart"
                customOptions={combineDefaultAndCustomOptions}
            />
        </div>
    )
}
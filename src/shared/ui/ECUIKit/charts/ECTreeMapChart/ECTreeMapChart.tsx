import { FC } from 'react'
import { TreeMapChart } from '@shared/ui/charts/highcharts/Charts'
import { TECTreeMapChart } from './types'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

const defaultOptions: Highcharts.Options = {
    credits: {
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
}

export const ECTreeMapChart: FC<TECTreeMapChart> = ({ data, height, width, dataLabels, tooltip }) => {
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
    const textColor = createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)

    const customOptions = {
        chart: {
            width: width || null,
            height: height || null,
            animation: false,
            backgroundColor: backgroundColor,
        },
        plotOptions: {
            series: {
                animation: false,
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
        navigator: {
            ...defaultOptions.navigator,
            xAxis: {
                labels: {
                    style: {
                        color: textColor || 'black',
                    },
                },
            },
        },
    }

    const combineDefaultAndCustomOptions = { ...defaultOptions, ...customOptions }

    return (
        <TreeMapChart
            seriesData={{
                type: 'treemap',
                layoutAlgorithm: 'sliceAndDice',
                data: data,
                dataLabels: dataLabels || {},
                tooltip: tooltip || {},
            }}
            customOptions={combineDefaultAndCustomOptions}
        />
    )
}
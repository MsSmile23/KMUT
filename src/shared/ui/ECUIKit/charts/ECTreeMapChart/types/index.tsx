import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'

export type TECTreeMapChart = {
    data: Highcharts.SeriesTreemapOptions['data']
    title?: string
    icon?: IECIconView['icon']
    color?: string
    height?: number
    width?: number
    legendSettings?: TLegendSettings,
    dataLabels?: Highcharts.SeriesTreemapOptions['dataLabels'],
    tooltip?: Highcharts.SeriesTreemapOptions['tooltip']
}

type TLegendSettings = {
    units: string
    typeValues: 'both' | 'absolute' | 'percentage'
    isEnabled: boolean
    showNames: boolean
    orientation: 'left' | 'right' | 'top' | 'bottom'
    type: 'callout' | 'horizontal' | 'vertical'
    width: number | string
    x?: number
    y?: number
    maxHeight?: number
    legendRatio?: number
    chartRatio?: number
    chart?: {
        height?: number
        width?: number
    }
    fontSize?: string
}
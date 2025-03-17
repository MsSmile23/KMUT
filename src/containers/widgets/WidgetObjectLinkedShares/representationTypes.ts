import { ILegendSettings } from '@pages/dev/vladimir/ResponsivePieChartWrapper/ResponsivePieChart'
import { TColor } from '@shared/types/common'

export type TRepresentationType = 'pieChart' | 'progressBar' | 'treemap' | 'statePorts'

export type TViewPropsPieChart = {
    // rightFromProgressBarView: any
    height?: number
    width?: number
    chartRatio?: ILegendSettings['chartRatio']
    legendRatio?: ILegendSettings['legendRatio']
    chartTitle?: string
    legendEnabled?: boolean
    showNames?: boolean
    roundDigits?: number
    showShortName?: boolean
    showCategoryTitle?: boolean
    orientation?: ILegendSettings['orientation']
    showObjectsTable?: boolean
}

export type TViewPropsProgressBar = {
    height?: number
    width?: number
    iconColor?: TColor
    rightFromTitleView?: 'absolute' | 'percent'
    rightFromProgressBarView?: 'absolute' | 'percent'
    precentType?: 'absolute' | 'calculated'
}



export type TViewPropsTreeMapChart = {
    height?: number
    valueDisplayType?: 'absolute' | 'percent' | 'combine'
}


export type TViewPropsStatusPorts = {
    height?: number
    directionViewPorts?: 'horizontal' | 'vertical'
}

export type TViewPropsVerticalHistogram = {
    height?: number
    legendItemWidth?: number,
    legendOffset?: number
    showPercents?: boolean
    maxValue?: number
}

export type TViewProps<T> = 
    T extends 'pieChart' ? TViewPropsPieChart :
    T extends 'progressBar' ? TViewPropsProgressBar :
    T extends 'treemap' ? TViewPropsTreeMapChart :
    T extends 'statePorts' ? TViewPropsStatusPorts :
    never;
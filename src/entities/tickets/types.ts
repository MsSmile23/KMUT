import { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'
import { TDurationLabels } from '@shared/utils/datetime'

export interface ILegendSettings {
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

export interface IViewPropsPieChart {
    rightFromProgressBarView: any
    height?: number
    width?: number
    chartRatio?: ILegendSettings['chartRatio']
    legendRatio?: ILegendSettings['legendRatio']
    chartTitle?: string
    legendEnabled?: boolean
}

export interface ITicketsContainerProps {
    parentObjectId: number
    representationType: 'progressBar' | 'wordCloud' | 'treemap' | 'pieChart' | 'horizontalBarChart'
    height?: number
    width?: number
    rightFromTitleView?: 'absolute' | 'percent'
    rightFromProgressBarView?: 'absolute' | 'percent'
    precentType?: 'absolute' | 'calculated'
    valueDisplayType?: 'absolute' | 'percent' | 'combine'
    viewProps?: IViewPropsPieChart
    countInRow?: number
    extract: 'none' | 'url' | 'host',
    attributeId: number,
    linkedObjectsForm?: ILinkedObjectsForm,
    period?: TDurationLabels,
    limit?: number,
    aggregation: 'count' | 'sum' | 'avg' | 'time',
    condition?: string,
    dataType: 'countStrings' | 'aggregation' | 'duration-incidents' | 'frequent-falls' | 'aggregation-incidents',
    time_units: 'min' | 'hour' | 'day'
    showPercent?: boolean
    labelMargin?: number,
    barColor?: string,
    barBackgroundColor?: string

}

export interface IData {
        id?: number
        count?: number
        name?: string
        value?: string
    }
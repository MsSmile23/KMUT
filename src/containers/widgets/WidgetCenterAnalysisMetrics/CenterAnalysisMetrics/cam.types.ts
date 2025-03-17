/* eslint-disable max-len */
import { IWidgetCenterAnalysisMetricsFormProps } from '../WidgetCenterAnalysisMetricsForm'

export interface ICenterAnalysisMetricsProps {
    vtemplateSettings: {
        vtemplateId: number
        classIds: number[]
        objectId: number
    }
    camVisualSettings?: {
        layout?: {
            verticalGap: number
            horizontalGap: number
            // backgroundColor?: string
            // padding?: number
            boxShadowColor?: string
            boxShadowWidth?: number
            borderColor?: string
            borderWidth?: number
            borderRadius?: number
        }
        tree?: {
            width?: number
            widthUnit?: 'px' | '%'
            showTitle?: boolean
            showOAttrValue?: boolean
            showButtons?: 'all' | 'graph' | 'multigraph' | 'none'
            OAttrValueWidth?: number
            titleButtonsWidth?: number
            shortenTitle?: boolean
            titleWidth?: number
            stepWidth?: number
        }
        treeToolbar?: any
        chart?: {
            padding?: number
            zonesGap?: number
            graphGap?: number
        }
        chartToolbar?: any
        templateToolbar?: any
    }
    classSettings: IWidgetCenterAnalysisMetricsFormProps
    height?: number
} 

export type ICommonStateArrayKeys = 'objectIds' | 'stateIdsFilter' | 'classIds'

export interface IOATreeState extends Record<ICommonStateArrayKeys, TIdsArray> {
    allExpanded: boolean
    // isDefault: boolean
    expandedKeys: string[]
    visibleLinkedClasses: number[]
    showHierarchy: boolean
    isGroupedByClass: boolean
    objectAttributeIds: TIdsArray
}

export interface IMultigraphState extends ICommonGraphState {
    activeOAIds: IObjWithOAIdsArray[][]
    // activeOAIds: TIdsArray[]
}
export interface IGraphState extends ICommonGraphState {
    activeOAIds: IObjWithOAIdsArray[]
    // activeOAIds: TIdsArray
}
export interface ICommonGraphState {
    gridCount: number
    isVisible: boolean
}



// common types
export type TChartZones = 'multigraph' | 'graph'
export type TExpandedKeys = string[]
export type TIdsArray = number[]
export interface IObjWithOAIdsArray {
    objectId: number
    oaId: number
    visible: boolean
}
export type TObjectWithOAAttributesSet = {
    multigraph: IObjWithOAIdsArray[][]
    graph: IObjWithOAIdsArray[]
}
export type TObjectAttributesSet = {
    multigraph: TIdsArray[]
    graph: TIdsArray
}
// export type TObjectAttributesSet = Record<TChartZones, TIdsArray>
export type TSetStateParams<T> = (entity: Partial<T>) => void
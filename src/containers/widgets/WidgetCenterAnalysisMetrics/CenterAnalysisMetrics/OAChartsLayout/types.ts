import { IWidgetCenterAnalysisMetricsFormProps } from '../../WidgetCenterAnalysisMetricsForm'
import { ICenterAnalysisMetricsProps, IOATreeState, IObjWithOAIdsArray } from '../cam.types'
import { IManageMetricsReturn } from '../useManageMetrics'

export interface IOAChartLayoutProps {
    multigraph: IOAChartLayoutMultiItemProps
    graph: IOAChartLayoutGraphItemProps
    classSettings: IWidgetCenterAnalysisMetricsFormProps
    visibleLinkedClasses: IOATreeState['visibleLinkedClasses']
    showHierarchy: IOATreeState['showHierarchy']
    isGroupedByClass: IOATreeState['isGroupedByClass']
    commonSettings: IManageMetricsReturn['params']['commonSettings']
    setCommonSettings: IManageMetricsReturn['methods']['setCommonSettings']
    setOATreeSettings: IManageMetricsReturn['methods']['setOATreeSettings']
    setOATreeToolbarSettings: IManageMetricsReturn['methods']['setOATreeToolbarSettings']
    visualSettings?: ICenterAnalysisMetricsProps['camVisualSettings']
}

export interface IOAChartLayoutMultiItemProps extends IOAChartLayoutItemCommonProps{
    activeOAIds: IObjWithOAIdsArray[][]
    // activeOAIds: TIdsArray[]
}
export interface IOAChartLayoutGraphItemProps extends IOAChartLayoutItemCommonProps {
    activeOAIds: IObjWithOAIdsArray[]
    // activeOAIds: TIdsArray
}
export interface IOAChartLayoutItemCommonProps {
    gridCount: number
}
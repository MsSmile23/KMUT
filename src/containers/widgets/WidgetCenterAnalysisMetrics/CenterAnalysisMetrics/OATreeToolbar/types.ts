import { ICenterAnalysisMetricsProps, IOATreeState, TSetStateParams } from '../cam.types'

type keys = keyof IOATreeState

export type TOATreeToolbarSettingsKeys = Extract<
    keys, 
    'allExpanded' | 
    'objectIds' | 
    'objectIdsFilter' | 
    'stateIdsFilter' | 
    'classIds' | 
    'objectAttributeIds' |
    'visibleLinkedClasses' |
    'showHierarchy' |
    'isGroupedByClass'
>
export type IOATreeToolbarParams = Pick<IOATreeState, TOATreeToolbarSettingsKeys>
export interface IOATreeToolbarProps extends IOATreeToolbarParams {
    setOATreeToolbarSettings: TSetStateParams<IOATreeToolbarParams>
    visualSettings?: ICenterAnalysisMetricsProps['camVisualSettings']
}
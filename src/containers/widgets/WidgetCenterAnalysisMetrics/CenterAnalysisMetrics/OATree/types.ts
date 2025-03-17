import { IWidgetCenterAnalysisMetricsFormProps } from '../../WidgetCenterAnalysisMetricsForm'
import { ICenterAnalysisMetricsProps, IOATreeState, TExpandedKeys, TObjectAttributesSet, TObjectWithOAAttributesSet, TSetStateParams } from '../cam.types'
import { IOATreeToolbarParams } from '../OATreeToolbar/types'
import { IManageMetricsReturn } from '../useManageMetrics'

export interface IOATreeProps extends TObjectWithOAAttributesSet, Omit<IOATreeToolbarParams, 'classIds'> {
// export interface IOATreeProps extends TObjectAttributesSet, Omit<IOATreeToolbarParams, 'classIds'> {
    expandedKeys: TExpandedKeys
    setOATreeSettings?: TSetStateParams<Omit<IOATreeProps, 'setOATreeSettings'>>
    handleActiveOAid?: IManageMetricsReturn['methods']['handleActiveOAid']
    toggleActiveOAid?: IManageMetricsReturn['methods']['toggleActiveOAid']
    classSettings: IWidgetCenterAnalysisMetricsFormProps
    visualSettings?: ICenterAnalysisMetricsProps['camVisualSettings']
}

export type TBranchingStatus = 'idle' | 'started' | 'finished'
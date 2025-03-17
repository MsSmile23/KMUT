import { ICenterAnalysisMetricsProps, /* ICenterAnalysisMetricsState,  */IOATreeState, TSetStateParams } from '../cam.types'
import { ICenterAnalysisMetricsState, ITemplatesStatus } from '../useManageMetrics'

export interface ICAMTemplatesToolbarProps /* extends Pick<IOATreeState, 'isDefault'>  */{
    vtemplateSettings: ICenterAnalysisMetricsProps['vtemplateSettings']
    templatesStatus: ITemplatesStatus
    setTemplatesStatus: (status: ITemplatesStatus) => void
    currentStateToTemplate: ICenterAnalysisMetricsState
    setTemplateToState?: TSetStateParams<any> 
    visualSettings?: ICenterAnalysisMetricsProps['camVisualSettings']
}
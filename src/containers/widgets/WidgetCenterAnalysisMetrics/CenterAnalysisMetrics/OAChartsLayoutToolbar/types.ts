import { ICenterAnalysisMetricsProps } from '../cam.types';
import { IOAChartLayoutProps } from '../OAChartsLayout/types';
import { IManageMetricsReturn } from '../useManageMetrics';

export interface IOAChartToolbarProps extends IOAChartLayoutProps {
// export interface IOAChartToolbarProps extends Omit<IOAChartLayoutProps, 'classSettings'> {
    resetActiveAds: IManageMetricsReturn['methods']['resetActiveAds']
    setGridCount: IManageMetricsReturn['methods']['setGridCount']
    setVisibleLinkedClasses: IManageMetricsReturn['methods']['setVisibleLinkedClasses']
    commonSettings: IManageMetricsReturn['params']['commonSettings']
    setCommonSettings: IManageMetricsReturn['methods']['setCommonSettings']
    visualSettings?: ICenterAnalysisMetricsProps['camVisualSettings']
}
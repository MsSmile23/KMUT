import { OAChartsLayoutToolbar } from './OAChartsLayoutToolbar/OAChartsLayoutToolbar'
import { OAChartsLayout } from './OAChartsLayout/OAChartsLayout'
import { OATree } from './OATree/OATree'
import { CAMTemplatesToolbar } from './CAMTemplatesToolbar/CAMTemplatesToolbar'
import { OATreeToolbar } from './OATreeToolbar/OATreeToolbar'
import { useManageMetrics } from './useManageMetrics'
import { FC } from 'react'
import { ICenterAnalysisMetricsProps } from './cam.types'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export const CenterAnalysisMetrics: FC<ICenterAnalysisMetricsProps> = (props) => {
    const { vtemplateSettings, classSettings, camVisualSettings } = props ?? {}
    // const { layout } = camVisualSettings ?? {}
    const { params, methods } = useManageMetrics(props)
    // console.log('params?.compHeight', params?.compHeight)
    // console.log('vtemplateSettings', vtemplateSettings)

    // console.log('camVisualSettings', camVisualSettings)

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = isShowcase ? createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) : 'white'

    return (
        <div
            style={{
                // position: 'static',
                display: 'flex',
                backgroundColor: backgroundColor ?? 'transparent',
                gap: `${camVisualSettings?.layout?.horizontalGap ?? 10}px`,
                // padding: camVisualSettings?.layout?.padding ?? '1px',
                height: '100%',
            }}
            className="CenterAnalysisMetrics"
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width:
                        camVisualSettings?.tree?.width && camVisualSettings?.tree?.widthUnit
                            ? `${camVisualSettings?.tree?.width}${camVisualSettings?.tree?.widthUnit}`
                            : '30%',
                    height: '100%',
                    gap: `${camVisualSettings?.layout?.verticalGap ?? 10}px`,
                }}
            >
                <OATreeToolbar
                    {...params.OATreeToolbarSettings}
                    setOATreeToolbarSettings={methods.setOATreeToolbarSettings}
                    visualSettings={camVisualSettings}
                />
                <OATree
                    {...params.OATreeSettings}
                    setOATreeSettings={methods.setOATreeSettings}
                    handleActiveOAid={methods.handleActiveOAid}
                    toggleActiveOAid={methods.toggleActiveOAid}
                    classSettings={classSettings}
                    visualSettings={camVisualSettings}
                />
                <CAMTemplatesToolbar
                    vtemplateSettings={vtemplateSettings}
                    templatesStatus={params.templatesStatus}
                    setTemplatesStatus={methods.setTemplatesStatus}
                    currentStateToTemplate={params.currentStateToTemplate}
                    setTemplateToState={methods.setTemplateToState}
                    visualSettings={camVisualSettings}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${camVisualSettings?.layout?.verticalGap ?? 10}px`,
                    flex: 1,
                    // width: '70%',
                    height: '100%',
                }}
            >
                <OAChartsLayoutToolbar
                    resetActiveAds={methods.resetActiveAds}
                    setGridCount={methods.setGridCount}
                    setVisibleLinkedClasses={methods.setVisibleLinkedClasses}
                    multigraph={{
                        gridCount: params.objectAttributes.multigraph.gridCount,
                        activeOAIds: params.objectAttributes.multigraph.activeOAIds,
                    }}
                    graph={{
                        activeOAIds: params.objectAttributes.graph.activeOAIds,
                        gridCount: params.objectAttributes.graph.gridCount,
                    }}
                    classSettings={classSettings}
                    visibleLinkedClasses={params.OATreeToolbarSettings.visibleLinkedClasses}
                    showHierarchy={params.OATreeToolbarSettings.showHierarchy}
                    isGroupedByClass={params.OATreeToolbarSettings.isGroupedByClass}
                    commonSettings={params.commonSettings}
                    setCommonSettings={methods.setCommonSettings}
                    setOATreeSettings={methods.setOATreeSettings}
                    setOATreeToolbarSettings={methods.setOATreeToolbarSettings}
                    visualSettings={camVisualSettings}
                />
                <OAChartsLayout
                    multigraph={{
                        activeOAIds: params.objectAttributes.multigraph.activeOAIds,
                        gridCount: params.objectAttributes.multigraph.gridCount,
                    }}
                    graph={{
                        activeOAIds: params.objectAttributes.graph.activeOAIds,
                        gridCount: params.objectAttributes.graph.gridCount,
                    }}
                    classSettings={classSettings}
                    setOATreeSettings={methods.setOATreeSettings}
                    visibleLinkedClasses={params.OATreeSettings.visibleLinkedClasses}
                    showHierarchy={params.OATreeSettings.showHierarchy}
                    isGroupedByClass={params.OATreeSettings.isGroupedByClass}
                    commonSettings={params.commonSettings}
                    setCommonSettings={methods.setCommonSettings}
                    setOATreeToolbarSettings={methods.setOATreeToolbarSettings}
                    visualSettings={camVisualSettings}
                />
            </div>
        </div>
    )
}
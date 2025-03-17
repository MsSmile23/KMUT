/* eslint-disable max-len */
import { FC } from 'react'
import { IOAChartLayoutProps } from './types'
import { OAChartLayoutZone } from './OAChartLayoutZone'
import AttributeHistoryChartContainer from '@containers/objects/AttributeHistoryChartContainer'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { MultipleChartContainerWithState } from './MultipleChartContainerWithState'
import { generalStore } from '@shared/stores/general'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useTheme } from '@shared/hooks/useTheme'

export const OAChartsLayout: FC<IOAChartLayoutProps> = (props) => {
    const { multigraph, graph, classSettings, commonSettings, visualSettings } = props ?? {}
    const defaultGap = visualSettings?.chart?.graphGap ? Number(visualSettings?.chart?.graphGap) : 10
    const theme = useTheme()
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : '#ffffff'
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    // console.log('commonSettings', commonSettings)

    return (
        <div
            className="OAChartsLayout"
            style={{
                display: 'flex',
                flexDirection: 'column',
                border: `${visualSettings?.layout?.borderWidth ?? 0}px solid ${
                    visualSettings?.layout?.borderColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                boxShadow: `0 0 ${visualSettings?.layout?.boxShadowWidth ?? 2}px ${
                    visualSettings?.layout?.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                borderRadius: `${visualSettings?.layout?.borderRadius ?? 8}px`,
                flex: 1,
                gap: `${visualSettings?.chart?.zonesGap ?? 10}px`,
                padding: `${visualSettings?.chart?.padding ?? 10}px`,
                overflowY: 'auto',
                background: backgroundColor ?? 'transparent',
            }}
        >
            {multigraph.activeOAIds.length > 0 && multigraph.activeOAIds[0].length > 0 && (
                <OAChartLayoutZone gap={defaultGap}>
                    {multigraph.activeOAIds
                        .filter((arrIds) => arrIds.filter((arrItem) => arrItem.visible).length > 0)
                        .map((arrIds) => {
                            const newArrIds = arrIds.filter((arrItem) => arrItem.visible)
                            const currentWidth = `calc((100% - ${defaultGap * (multigraph.gridCount - 1)}px) / ${
                                multigraph.gridCount
                            })`

                            return (
                                <div
                                    key={newArrIds.map((it) => `${it.oaId}-${it.objectId}`).join('.')}
                                    style={{
                                        width: currentWidth,
                                    }}
                                    className="OAChart"
                                >
                                    <MultipleChartContainerWithState
                                        background={backgroundColor}
                                        color={textColor}
                                        oaIds={newArrIds}
                                        classSettings={classSettings}
                                        gridCount={multigraph.gridCount}
                                        chartWidth={currentWidth}
                                        commonSettings={{
                                            ...commonSettings,
                                            dateInterval:
                                                commonSettings?.dateInterval?.[0] && commonSettings?.dateInterval?.[1]
                                                    ? (commonSettings?.dateInterval.map((it) => String(it)) as [
                                                          string,
                                                          string
                                                      ])
                                                    : undefined,
                                        }}
                                    />
                                </div>
                            )
                        })}
                </OAChartLayoutZone>
            )}
            {graph.activeOAIds.length > 0 && (
                <OAChartLayoutZone gap={defaultGap}>
                    {graph.activeOAIds
                        .filter((activeItem) => activeItem.visible)
                        .map((activeItem) => {
                            const currentObject = getObjectByIndex('id', activeItem.objectId)
                            const currentOA = currentObject?.object_attributes.find((oa) => oa.id === activeItem.oaId)
                            const currentWidth = `calc((100% - ${defaultGap * (graph.gridCount - 1)}px) / ${
                                graph.gridCount
                            })`

                            return (
                                <div
                                    key={activeItem.oaId}
                                    style={{
                                        width: currentWidth,
                                    }}
                                    className="OAChart"
                                >
                                    <AttributeHistoryChartContainer
                                        color={textColor}
                                        background={backgroundColor}
                                        ids={[
                                            {
                                                id: activeItem.oaId,
                                                oa: currentOA,
                                                sort_order: currentOA.attribute.sort_order,
                                                viewTypeId: currentOA.attribute.view_type_id,
                                                // @ts-ignore
                                                viewType: currentOA.attribute.view_type ?? '',
                                            },
                                        ]}
                                        limit={commonSettings?.limit}
                                        commonSettings={{
                                            height: classSettings?.chartHeight,
                                            legendPosition: classSettings?.legendPosition,
                                            dateInterval:
                                                commonSettings?.dateInterval?.[0] && commonSettings?.dateInterval?.[1]
                                                    ? (commonSettings?.dateInterval.map((it) => String(it)) as [
                                                          string,
                                                          string
                                                      ])
                                                    : undefined,
                                        }}
                                    />
                                </div>
                            )
                        })}
                </OAChartLayoutZone>
            )}
            {(multigraph.activeOAIds.length === 0 || multigraph.activeOAIds.every((arr) => arr.length === 0)) &&
                graph.activeOAIds.length === 0 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        fontSize: 20,
                    }}
                >
                        Выберите измерения для отображения
                </div>
            )}
        </div>
    )
}
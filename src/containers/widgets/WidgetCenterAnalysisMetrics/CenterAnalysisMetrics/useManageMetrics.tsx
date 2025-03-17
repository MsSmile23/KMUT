/* eslint-disable max-len */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { TChartZones, IGraphState, IOATreeState, TSetStateParams, 
    ICenterAnalysisMetricsProps, IMultigraphState, 
    IObjWithOAIdsArray, TObjectWithOAAttributesSet } from './cam.types'
import { IOATreeToolbarParams, IOATreeToolbarProps } from './OATreeToolbar/types'
import { IOAChartLayoutGraphItemProps, IOAChartLayoutMultiItemProps } from './OAChartsLayout/types'
import { IOATreeProps } from './OATree/types'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { mergeArrays } from './cam.utils'
// import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { OpUnitType } from 'dayjs'

interface ICamCommonSettings {
    limit?: number
    dateInterval?: [number, number]
    defaultPeriod?: OpUnitType | string
}
export type ITemplatesStatus = 'idle' | 'loading' | 'finished' | 'noTemplates'
export interface ICenterAnalysisMetricsState {
    OATree: IOATreeState
    multigraph: IMultigraphState
    graph: IGraphState
    commonSettings: ICamCommonSettings
}

export interface IManageMetricsReturn {
    params: {
        templatesStatus: ITemplatesStatus
        currentStateToTemplate: ICenterAnalysisMetricsState
        objectAttributes: {
            multigraph: IOAChartLayoutMultiItemProps
            graph: IOAChartLayoutGraphItemProps
        }
        // objectAttributes: Record<TChartZones, Omit<IOAChartLayoutItemProps, 'isVisible'>>
        OATreeToolbarSettings: IOATreeToolbarParams
        OATreeSettings: Omit<IOATreeProps, 'setOATreeSettings' | 'handleActiveOAid' | 'classSettings'>
        commonSettings: ICamCommonSettings
    },
    methods: {
        setCommonSettings: (settings: Partial<ICenterAnalysisMetricsState['commonSettings']>) => void
        setVisibleLinkedClasses: (classes: number[]) => void
        setTemplatesStatus: (status: ITemplatesStatus) => void
        setTemplateToState: (props: ICenterAnalysisMetricsState) => void
        // setActiveObjectAttributes: (props: TObjectAttributesSet, index?: number) => void
        setActiveObjectAttributes: TSetStateParams<TObjectWithOAAttributesSet>
        // setActiveObjectAttributes: TSetStateParams<TObjectAttributesSet>
        setOATreeSettings: IOATreeProps['setOATreeSettings']
        setOATreeToolbarSettings: IOATreeToolbarProps['setOATreeToolbarSettings']
        resetActiveAds: TSetStateParams<TChartZones>
        setGridCount: (chartZone: TChartZones, gridCount: number) => void
        toggleActiveOAid: (id: number) => void
        handleActiveOAid: (props: { 
            chartZone: TChartZones, 
            id: number, 
            objectId: number, 
            idx?: number
        }) => void
    }
}
export type TManageMetrics = (props: ICenterAnalysisMetricsProps) => IManageMetricsReturn


export const useManageMetrics: TManageMetrics = (props) => {
    const { classSettings, vtemplateSettings } = props
    const getObjByIndex = useObjectsStore(selectObjectByIndex)
    const vtemplateObject = getObjByIndex('id', vtemplateSettings?.objectId)
    // const allClasses = useClassesStore(selectClasses)
    // console.log('useManageMetrics props', props)


    useEffect(() => {
        setCompState(prev => {
            return {
                ...prev,
                OATree: {
                    ...prev.OATree,
                    classIds: vtemplateSettings?.objectId
                        ? [vtemplateObject?.class_id]
                        // ? classSettings.rootClasses
                        //     ? [...classSettings.rootClasses, vtemplateObject.class_id]
                        //     : [vtemplateObject.class_id]
                        : classSettings?.rootClasses,
                    objectIds: mergeArrays([
                        prev.OATree.objectIds,
                        vtemplateSettings?.objectId 
                            ? [vtemplateSettings.objectId] 
                            : undefined,
                        classSettings?.rootObjects
                    ])
                },
                commonSettings: {
                    ...prev.commonSettings,
                    defaultPeriod: classSettings?.defaultPeriod
                }
            }
        })
    }, [
        vtemplateSettings?.objectId,
        classSettings?.rootClasses,
        classSettings?.rootObjects,
        classSettings?.defaultPeriod
    ])

    const [templatesStatus, setTemplatesStatus] = useState<ITemplatesStatus>('idle')
    const [compState, setCompState] = useState<ICenterAnalysisMetricsState>({
        OATree: {
            classIds: classSettings?.rootClasses ?? [],
            allExpanded: true,
            expandedKeys: [],
            stateIdsFilter: [],
            objectIds: classSettings?.rootObjects ?? [],
            objectAttributeIds: [],
            visibleLinkedClasses: [],
            showHierarchy: false,
            isGroupedByClass: false
        },
        multigraph: {
            activeOAIds: [],
            gridCount: 1,
            isVisible: true
        },
        graph: {
            activeOAIds: [],
            gridCount: 2,
            isVisible: true
        },
        commonSettings: {
            dateInterval: [undefined, undefined],
            limit: undefined,
            defaultPeriod: classSettings?.defaultPeriod
        }

    })

    // console.log('useManageMetrics state', compState)
    
    const allState = useMemo(() => {
        return compState
    }, [compState])
    
    const commonSettings = useMemo<ICenterAnalysisMetricsState['commonSettings']>(() => {
        return {
            dateInterval: compState.commonSettings?.dateInterval,
            limit: compState.commonSettings?.limit,
            defaultPeriod: compState.commonSettings?.defaultPeriod,
        }
    }, [
        compState.commonSettings?.dateInterval,
        compState.commonSettings?.limit,
        compState.commonSettings?.defaultPeriod,
    ])

    const treeParams = useMemo(() => {
        return {
            classIds: compState.OATree.classIds,
            allExpanded: compState.OATree.allExpanded,
            expandedKeys: compState.OATree.expandedKeys,
            stateIdsFilter: compState.OATree.stateIdsFilter,
            objectIds: compState.OATree.objectIds,
            objectAttributeIds: compState.OATree.objectAttributeIds,
            visibleLinkedClasses: compState.OATree.visibleLinkedClasses,
            showHierarchy: compState.OATree.showHierarchy,
            isGroupedByClass: compState.OATree.isGroupedByClass,
        }
    }, [
        compState.OATree.classIds,
        compState.OATree.allExpanded,
        compState.OATree.expandedKeys,
        compState.OATree.stateIdsFilter,
        compState.OATree.objectIds,
        compState.OATree.objectAttributeIds,
        compState.OATree.visibleLinkedClasses,
        compState.OATree.showHierarchy,
        compState.OATree.isGroupedByClass,
    ])

    const allGraphs = useMemo(() => {
        return {
            graph: compState.graph,
            multigraph: compState.multigraph
        }
    }, [
        compState.graph,
        compState.multigraph,
    ])

    const toggleActiveOAid = useCallback<IManageMetricsReturn['methods']['toggleActiveOAid']>((id) => {
        setCompState(prev => {
            return {
                ...prev,
                graph: {
                    ...prev.graph,
                    activeOAIds: prev.graph.activeOAIds.map(item => {
                        return item.oaId === id
                            ? { ...item, visible: !item.visible }
                            : item
                    })
                },
                multigraph: {
                    ...prev.multigraph,
                    activeOAIds: prev.multigraph.activeOAIds.map(arr => {
                        const isIn = arr.some(it => it.oaId === id)
                        
                        return isIn
                            ? arr.map(item => {
                                return item.oaId === id
                                    ? { ...item, visible: !item.visible }
                                    : item
                            })
                            : arr
                    })
                }
            }
        })
    }, [
        compState.graph.activeOAIds,
        compState.multigraph.activeOAIds,
    ])

    const handleActiveOAid = useCallback<IManageMetricsReturn['methods']['handleActiveOAid']>(({
        chartZone, 
        id, 
        objectId, 
        idx
    }) => {
        const isIn = chartZone === 'multigraph' 
            ? compState[chartZone].activeOAIds.some(arr => arr.findIndex((arrItem) => arrItem.oaId === id) > -1)
            : compState[chartZone].activeOAIds.findIndex(arrItem => arrItem.oaId === id) > -1

        setCompState(prev => {
            const newActiveOAIds = isIn
                ? chartZone === 'multigraph' 
                    ? prev[chartZone].activeOAIds.reduce((acc, arr) => {
                        const isInArr = arr.findIndex((arrItem) => arrItem.oaId === id) > -1

                        if (isInArr) {
                            if (arr.length === 1) {
                                return acc
                            } else {
                                const newArr = arr.filter(item => item.oaId !== id)

                                acc.push(newArr)
                            }
                        } else {
                            acc.push(arr)
                        }
                            
                        return acc
                    }, [] as IObjWithOAIdsArray[][])
                    : prev[chartZone].activeOAIds.filter(item => item.oaId !== id)
                : chartZone === 'multigraph'
                    ? prev[chartZone].activeOAIds.length > 0
                        ? idx === prev[chartZone].activeOAIds.length
                            ? [...prev[chartZone].activeOAIds, [{ oaId: id, objectId, visible: true }]]
                            : prev[chartZone].activeOAIds.map((arr, index) => {
                                return idx === index    
                                    ? [...arr, { oaId: id, objectId, visible: true }]
                                    : arr
                            })
                        : [[{ oaId: id, objectId, visible: true }]]
                    : [...prev[chartZone].activeOAIds, { oaId: id, objectId, visible: true }]

            return {
                ...prev,
                [chartZone]: {
                    ...prev[chartZone],
                    activeOAIds: newActiveOAIds
                }
            }
        })
    }, [
        compState.graph.activeOAIds,
        compState.multigraph.activeOAIds,
    ])

    const setVisibleLinkedClasses = useCallback<IManageMetricsReturn['methods']['setVisibleLinkedClasses']>((classes) => {
        setCompState(prev => {
            return {
                ...prev,
                OATree: {
                    ...prev.OATree,
                    visibleLinkedClasses: classes
                }
            }
        })
    }, [])

    const setCommonSettings = useCallback<IManageMetricsReturn['methods']['setCommonSettings']>((settings) => {
        setCompState(prev => {
            return {
                ...prev,
                commonSettings: {
                    ...prev.commonSettings,
                    ...settings
                }
            }
        })
    }, [])

    return {
        params: {
            templatesStatus,
            currentStateToTemplate: allState,
            objectAttributes: {
                multigraph: {
                    activeOAIds: allGraphs.multigraph.activeOAIds,
                    gridCount: allGraphs.multigraph.gridCount,
                },
                graph: {
                    activeOAIds: allGraphs.graph.activeOAIds,
                    gridCount: allGraphs.graph.gridCount,
                }
            },
            commonSettings,
            OATreeSettings: {
                allExpanded: treeParams.allExpanded,
                expandedKeys: treeParams.expandedKeys,
                graph: allGraphs.graph.activeOAIds,
                multigraph: allGraphs.multigraph.activeOAIds,
                objectIds: treeParams.objectIds,
                stateIdsFilter: treeParams.stateIdsFilter,
                objectAttributeIds: treeParams.objectAttributeIds,
                visibleLinkedClasses: treeParams.visibleLinkedClasses,
                showHierarchy: treeParams.showHierarchy,
                isGroupedByClass: treeParams.isGroupedByClass,
            },
            OATreeToolbarSettings: {
                classIds: treeParams.classIds,
                allExpanded: treeParams.allExpanded,
                stateIdsFilter: treeParams.stateIdsFilter,
                objectIds: treeParams.objectIds,
                objectAttributeIds: treeParams.objectAttributeIds,
                visibleLinkedClasses: treeParams.visibleLinkedClasses,
                showHierarchy: treeParams.showHierarchy,
                isGroupedByClass: treeParams.isGroupedByClass,
            },
        },
        methods: {
            setTemplatesStatus: (status) => {
                setTemplatesStatus(status)
            },
            setTemplateToState: (template) => {
                setCompState(prev => {
                    // const newDateInterval = !template?.commonSettings?.dateInterval
                    //     ? undefined
                    //     : template.commonSettings?.dateInterval

                    return {
                        ...prev,
                        ...template,
                        // ...newDateInterval
                    }
                })
            },
            setActiveObjectAttributes: (objectAttributes) => {
                setCompState(prev => {
                    return {
                        ...prev,
                        multigraph: {
                            ...prev.multigraph,
                            activeOAIds: objectAttributes.multigraph
                        },
                        graph: {
                            ...prev.graph,
                            activeOAIds: objectAttributes.graph
                        }
                    }
                })
            },
            
            setOATreeSettings: (setting) => {
                setCompState(prev => {
                    return {
                        ...prev,
                        OATree: {
                            ...prev.OATree,
                            ...setting
                        }
                    }
                })
            },
            setOATreeToolbarSettings: (setting) => {
                setCompState(prev => {
                    return {
                        ...prev,
                        OATree: {
                            ...prev.OATree,
                            ...setting
                        }
                    }
                })
            },
            resetActiveAds: (zone: TChartZones) => {
                setCompState(prev => {
                    return {
                        ...prev,
                        [zone]: {
                            ...prev[zone],
                            activeOAIds: []
                        }
                    }
                })
            },
            setGridCount: (zone: TChartZones, gridCount: number) => {
                setCompState(prev => {
                    return {
                        ...prev,
                        [zone]: {
                            ...prev[zone],
                            gridCount
                        }
                    }
                })
            },
            // handleActiveOAid,
            toggleActiveOAid,
            /* toggleActiveOAid: (id) => {
                setCompState(prev => {
                    return {
                        ...prev,
                        graph: {
                            ...prev.graph,
                            activeOAIds: prev.graph.activeOAIds.map(item => {
                                return item.oaId === id
                                    ? { ...item, visible: !item.visible }
                                    : item
                            })
                        },
                        multigraph: {
                            ...prev.multigraph,
                            activeOAIds: prev.multigraph.activeOAIds.map(arr => {
                                const isIn = arr.some(it => it.oaId === id)
                                
                                return isIn
                                    ? arr.map(item => {
                                        return item.oaId === id
                                            ? { ...item, visible: !item.visible }
                                            : item
                                    })
                                    : arr
                            })
                        }
                    }
                })
            }, */
            handleActiveOAid,
            /* handleActiveOAid: ({
                chartZone, 
                id, 
                objectId, 
                idx
            }) => {
                const isIn = chartZone === 'multigraph' 
                    ? compState[chartZone].activeOAIds.some(arr => arr.findIndex((arrItem) => arrItem.oaId === id) > -1)
                    : compState[chartZone].activeOAIds.findIndex(arrItem => arrItem.oaId === id) > -1

                setCompState(prev => {
                    const newActiveOAIds = isIn
                        ? chartZone === 'multigraph' 
                            ? prev[chartZone].activeOAIds.reduce((acc, arr) => {
                                const isInArr = arr.findIndex((arrItem) => arrItem.oaId === id) > -1

                                if (isInArr) {
                                    if (arr.length === 1) {
                                        return acc
                                    } else {
                                        const newArr = arr.filter(item => item.oaId !== id)

                                        acc.push(newArr)
                                    }
                                } else {
                                    acc.push(arr)
                                }
                                    
                                return acc
                            }, [] as IObjWithOAIdsArray[][])
                            // }, [] as TIdsArray[])
                            : prev[chartZone].activeOAIds.filter(item => item.oaId !== id)
                        : chartZone === 'multigraph'
                            ? prev[chartZone].activeOAIds.length > 0
                                ? idx === prev[chartZone].activeOAIds.length
                                    ? [...prev[chartZone].activeOAIds, [{ oaId: id, objectId, visible: true }]]
                                    : prev[chartZone].activeOAIds.map((arr, index) => {
                                        return idx === index    
                                            ? [...arr, { oaId: id, objectId, visible: true }]
                                            : arr
                                    })
                                : [[{ oaId: id, objectId, visible: true }]]
                            : [...prev[chartZone].activeOAIds, { oaId: id, objectId, visible: true }]

                    return {
                        ...prev,
                        [chartZone]: {
                            ...prev[chartZone],
                            activeOAIds: newActiveOAIds
                        }
                    }
                })
            } */
            setVisibleLinkedClasses,
            setCommonSettings
        }
    }
}
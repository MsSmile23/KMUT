/* eslint-disable max-len */
import { FC, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { IOATreeProps, TBranchingStatus } from './types'
import DirectoryTree from 'antd/es/tree/DirectoryTree'
import { Spin, type TreeDataNode } from 'antd'
import { extractOAidFromPath, getBranch, StringArray, NumberArray } from './oatree.utils'
import './tree.css'
import { useClassesStore } from '@shared/stores/classes'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IObjWithOAIdsArray } from '../cam.types'
import { useCheckOAStates } from '@shared/hooks/useCheckOAStates'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

export const OATree: FC<IOATreeProps> = (props) => {
    const {
        allExpanded,
        expandedKeys,
        objectIds,
        objectAttributeIds,
        multigraph,
        graph,
        visibleLinkedClasses,
        isGroupedByClass,
        showHierarchy,
        setOATreeSettings,
        handleActiveOAid,
        toggleActiveOAid,
        classSettings,
        stateIdsFilter,
        visualSettings,
    } = props ?? {}
    const getObjByIndex = useObjectsStore(selectObjectByIndex)
    const getMeasurableObjectAttributesList = useObjectsStore((st) => st.getMeasurableObjectAttributesList)
    const getClassesMeasurableAttributesIdsList = useClassesStore((st) => st.getClassesMeasurableAttributesIdsList)
    const getClassesIdsList = useClassesStore((st) => st.getClassesIdsList)

    const treeContainerRef = useRef(null)

    const containerSizes = useMemo<{
        width: number
        height: number
    }>(() => {
        return {
            width: treeContainerRef.current?.clientWidth,
            height: treeContainerRef.current?.clientHeight,
        }
    }, [
        treeContainerRef.current?.clientWidth,
        treeContainerRef.current?.clientHeight,
        document.body.clientHeight,
        document.body.clientWidth,
    ])

    const [loadingStatus, setLoadingStatus] = useState<TBranchingStatus>('idle')

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : '#000000'
    const background = isShowcase ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) : '#ffffff'

    const childrenObjects = useMemo<{
        paths: StringArray
        currentObjectIds: NumberArray
        objectAttributeIds: NumberArray
        defaultExpandedKeys: StringArray
    }>(() => {
        const currentObjectIds: NumberArray = []
        const objectAttributeIds: NumberArray = []
        const defaultExpandedKeys: StringArray = []
        const currentLinkedClasses =
            classSettings?.classes &&
            classSettings?.classes.length > 0 &&
            classSettings?.classes[0]?.target.length > 0 &&
            classSettings?.classes[0]?.linking.length > 0
                ? classSettings?.classes
                : [
                    {
                        linking: getClassesIdsList(),
                        target: Object.keys(getClassesMeasurableAttributesIdsList()).map((cls) => Number(cls)),
                    },
                ]

        // console.log('isGroupedByClass', isGroupedByClass)
        // console.log('showHierarchy', showHierarchy)
        // const showHierarchy = true
        // const isGroupedByClass = true
        const allChildrenObjectsPaths: StringArray = currentLinkedClasses.reduce((result, linkItem) => {
            objectIds.forEach((id) => {
                const rootObjectOAttrs = getMeasurableObjectAttributesList(id)
                const currentObject = getObjByIndex('id', id)
                // console.log('rootObjectOAttrs of', id, rootObjectOAttrs)

                if (rootObjectOAttrs.length > 0) {
                    defaultExpandedKeys.push(`${id}`)
                    currentObjectIds.push(id)
                    rootObjectOAttrs.forEach((oa) => {
                        defaultExpandedKeys.push(`${id}`, `${oa.id}`)

                        const path = isGroupedByClass
                            ? `${id}.${currentObject?.class_id}oa${id}oa${oa.id}`
                            : `${id}.${id}oa${oa.id}`

                        result.push(path)
                        objectAttributeIds.push(oa.id)
                    })
                }

                const childrenObjectsData = findChildObjectsWithPaths({
                    currentObj: getObjByIndex('id', id),
                    childClassIds: linkItem.linking,
                    targetClassIds: linkItem.target,
                    visibleClasses: visibleLinkedClasses?.length > 0 ? visibleLinkedClasses : [],
                }).objectsWithPath

                // console.log('childrenObjectsData', childrenObjectsData.find(it => it.id === 12991))
                // console.log('childrenObjectsData', childrenObjectsData)
                childrenObjectsData.forEach((child) => {
                    const childObjectOAttrs = getMeasurableObjectAttributesList(child.id)

                    // console.log('childObjectOAttrs of', child.id, childObjectOAttrs)

                    if (childObjectOAttrs.length > 0) {
                        const rooIdPath = `${id}`
                        const childIdPath = `${child.id}`
                        const childClassIdPath = `cls${child.classId}`

                        currentObjectIds.push(child.id)
                        defaultExpandedKeys.push(rooIdPath)
                        // console.log('rootPath', rooIdPath)

                        if (showHierarchy) {
                            const arr = child.paths.allArr

                            arr.forEach((path, idx) => {
                                // const newPath = `${id}.${arr.slice(0, idx + 1).map(a => a.id).join('.')}`

                                let newPath

                                if (idx !== arr.length - 1) {
                                    newPath = `${id}.${arr
                                        .slice(0, idx + 1)
                                        .map((a) => a.id)
                                        .join('.')}`
                                } else {
                                    const firstPart = `${id}.${arr
                                        .slice(0, idx)
                                        .map((a) => a.id)
                                        .join('.')}.${childClassIdPath}`

                                    defaultExpandedKeys.push(firstPart)
                                    // console.log('firstPart', firstPart)

                                    newPath = `${firstPart}.${path.id}`
                                }

                                // console.log('newPath', newPath)
                                defaultExpandedKeys.push(newPath)
                            })
                        }

                        childObjectOAttrs.forEach((oa) => {
                            const childPath =
                                showHierarchy && child.paths.visibleStr
                                    ? isGroupedByClass
                                        ? `${child.paths.visibleStr}.${childClassIdPath}.${childIdPath}`
                                        : `${child.paths.visibleStr}.${childIdPath}`
                                    : isGroupedByClass
                                        ? `${childClassIdPath}.${childIdPath}`
                                        : `${childIdPath}`
                            const oaPath = `${child.id}oa${oa.id}`

                            const path = `${rooIdPath}.${childPath}.${oaPath}`

                            // console.log('path', path)

                            if (!isGroupedByClass) {
                                defaultExpandedKeys.push(`${rooIdPath}.${childPath}`)
                            }

                            result.push(path)
                            // console.log('result path', path)
                            defaultExpandedKeys.push(path)
                            objectAttributeIds.push(oa.id)
                        })
                    }
                })
            })

            return result
        }, [] as StringArray)

        return {
            paths: allChildrenObjectsPaths,
            objectAttributeIds,
            currentObjectIds,
            defaultExpandedKeys: [...new Set(defaultExpandedKeys)].sort(),
        }
    }, [
        objectIds.join('.'),
        visibleLinkedClasses?.join('.'),
        (classSettings?.classes ?? [])
            .map((linkItem, idx) => {
                // (currentLinkedClasses ?? []).map((linkItem, idx) => {
                return `${idx}-linking[${linkItem.linking.join('.')}]-target[${linkItem.target.join('.')}]`
            })
            .join('--'),
        showHierarchy,
        isGroupedByClass,
    ])

    // console.log('classSettings', classSettings)

    useEffect(() => {
        // console.log('expandedKeys', expandedKeys)
        if (classSettings?.defaultExpand) {
            if (allExpanded && expandedKeys.length === 0) {
                setOATreeSettings({ expandedKeys: childrenObjects.defaultExpandedKeys })
            }
        }
    }, [
        allExpanded,
        expandedKeys.join('-'),
        childrenObjects.defaultExpandedKeys.join('-'),
        classSettings?.defaultExpand,
    ])
    const { oaStates, objStates } = useCheckOAStates({
        objectAttributeIds: childrenObjects.currentObjectIds,
        currentObjectIds: childrenObjects.currentObjectIds,
    })

    useEffect(() => {
        setOATreeSettings({ objectAttributeIds: childrenObjects.objectAttributeIds })
    }, [childrenObjects.objectAttributeIds.join('%')])

    const filteredByStatePaths = useMemo<StringArray>(() => {
        return childrenObjects.paths.reduce((result, path) => {
            const oaId = extractOAidFromPath(path)
            const graphIdx = graph.findIndex((it) => it.oaId === oaId)
            const multigraphItem = multigraph.reduce((res, arr, arrIdx) => {
                const idx = arr.findIndex((it) => it.oaId === oaId)

                if (idx > -1) {
                    res = multigraph[arrIdx][idx]
                }

                return res
            }, {} as IObjWithOAIdsArray)

            if (stateIdsFilter.length > 0) {
                const stateItemIdx = oaStates.findIndex((it) => it.oaId === oaId)
                const stateStereoId = stateItemIdx > -1 ? oaStates[stateItemIdx].stereoId : 0
                // const stateStereoId = getOAStateStereoId(oaId)

                if (stateIdsFilter.includes(stateStereoId)) {
                    result.push(path)
                    // acc.push(`${path}.stereo.${stateStereoId}`)

                    // если стейт совпадает, но состояние visible === false
                    if (
                        (graphIdx > -1 && !graph[graphIdx].visible) ||
                        ('visible' in multigraphItem && !multigraphItem.visible)
                    ) {
                        toggleActiveOAid(oaId)
                    }
                } else {
                    // если стейт не совпадает, но состояние visible === true
                    if (
                        (graphIdx > -1 && graph[graphIdx].visible) ||
                        ('visible' in multigraphItem && multigraphItem.visible)
                    ) {
                        toggleActiveOAid(oaId)
                    }
                }
            } else {
                // если фильтр стейтов снят, но состояние visible === false
                if (
                    (graphIdx > -1 && !graph[graphIdx].visible) ||
                    ('visible' in multigraphItem && !multigraphItem.visible)
                ) {
                    toggleActiveOAid(oaId)
                }
                result.push(path)
            }

            return result
        }, [] as StringArray)
    }, [
        childrenObjects.paths.join('%'),
        stateIdsFilter.join('-'),
        oaStates.map((state) => `${state.oaId}-${state.stateId}-${state.stereoId}`).join('.'),
    ])

    const filteredTreeBranches = useMemo<TreeDataNode[]>(() => {
        setLoadingStatus((prev) => 'started')

        const currentTree: TreeDataNode[] = []

        if (filteredByStatePaths.length === 0) {
            setLoadingStatus('finished')

            return currentTree
        } else {
            filteredByStatePaths.forEach((path, idx) => {
                getBranch({
                    path,
                    currentNodeProps: {
                        handleActiveOAid,
                        activeIds: {
                            graph,
                            multigraph,
                        },
                    },
                    currentTree,
                    setStatus:
                        idx === filteredByStatePaths.length - 1
                            ? (status: TBranchingStatus) => setLoadingStatus(status)
                            : undefined,
                    containerWidth: containerSizes.width,
                })
            })

            return currentTree
        }
    }, [
        filteredByStatePaths.join('%'),
        graph.map((it) => `${it.oaId}.${it.visible}`).join('%'),
        multigraph.map((arr) => arr.map((it) => `${it.oaId}.${it.visible}`).join('%')).join('_'),
        oaStates.map((state) => `${state.oaId}-${state.stateId}-${state.stereoId}`).join('.'),
        objStates.map((state) => `${state.objId}-${state.stateId}-${state.stereoId}`).join('.'),
        containerSizes.width,
    ])

    // console.log('containerSizes.width', containerSizes.width)
    // console.log('loadingStatus', loadingStatus)

    const onExpand = (keys: StringArray) => {
        if (!allExpanded) {
            setOATreeSettings({
                allExpanded: true,
            })
        } else {
            setOATreeSettings({ expandedKeys: keys })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'left',
                flex: 1,
                position: 'relative',
                padding: 10,
                backgroundColor: background ?? 'transparent',
                border: `${visualSettings?.layout?.borderWidth ?? 0}px solid ${
                    visualSettings?.layout?.borderColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                boxShadow: `0 0 ${visualSettings?.layout?.boxShadowWidth ?? 2}px ${
                    visualSettings?.layout?.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                borderRadius: `${visualSettings?.layout?.borderRadius ?? 8}px`,
                overflow: 'hidden',
            }}
            ref={treeContainerRef}
        >
            <RootObjectsChecker rootObjectsCount={objectIds?.length}>
                <TreeBuildingStatusChecker loadingStatus={loadingStatus}>
                    <TreeBranchesChecker branchesCount={filteredTreeBranches?.length}>
                        <DirectoryTree
                            expandedKeys={
                                allExpanded
                                    ? // ? resultExpandedKeys
                                    expandedKeys
                                    : []
                            }
                            onSelect={() => {
                                return
                            }}
                            onExpand={onExpand}
                            treeData={filteredTreeBranches}
                            virtual
                            showIcon={false}
                            selectable={false}
                            className="customTree"
                            height={containerSizes.height - 20}
                            style={{ background: background ?? '#ffffff', color: color }}
                        />
                    </TreeBranchesChecker>
                </TreeBuildingStatusChecker>
            </RootObjectsChecker>
        </div>
    )
}

const RootObjectsChecker: FC<
    PropsWithChildren<{
        rootObjectsCount: number
    }>
> = ({ rootObjectsCount, children }) => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            {!rootObjectsCount || rootObjectsCount === 0 ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <span
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        Выберите объекты для отображения
                    </span>
                </div>
            ) : (
                children
            )}
        </div>
    )
}

const TreeBranchesChecker: FC<
    PropsWithChildren<{
        branchesCount: number
    }>
> = ({ branchesCount, children }) => {
    if (!branchesCount || branchesCount === 0) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                Нет данных
            </div>
        )
    }

    return children
}

const TreeBuildingStatusChecker: FC<
    PropsWithChildren<{
        loadingStatus: TBranchingStatus
    }>
> = ({ loadingStatus, children }) => {
    if (loadingStatus !== 'finished') {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Spin />
            </div>
        )
    }

    return children
}
import { useObjectsStore } from '@shared/stores/objects'
import { TreeDataNode } from 'antd'
import { IManageMetricsReturn } from '../useManageMetrics'
import { IWidgetCenterAnalysisMetricsFormProps } from '../../WidgetCenterAnalysisMetricsForm'
import { IOATreeState, TObjectWithOAAttributesSet } from '../cam.types'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { useClassesStore } from '@shared/stores/classes'
import { PACKAGE_AREA } from '@shared/config/entities/package'
// import OATreeCustomNodeMemo from './OATreeCustomNode'
import { OATreeCustomNode } from './OATreeCustomNode'
import { OATreeCustomTitle } from './OATreeCustomTitle'
import { IObject, IObjectAttribute } from '@shared/types/objects'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useStatesStore } from '@shared/stores/states'
import { getStateViewParamsWithStereotype } from '@shared/utils/states'
import { IState } from '@shared/types/states'
import OATreeCustomNodeMemoized from './OATreeCustomNodeMemoized'
import OATreeCustomTitleMemoized from './OATreeCustomTitleMemoized'
import { TBranchingStatus } from './types'
import { IClass } from '@shared/types/classes'

export interface IResult {
    paths: StringArray
    objectAttributeIds: NumberArray
}
export type refNodes = {
    id: number
    ref: HTMLElement
    stereoId: number
}
export type StringArray = string[]
export type NumberArray = number[]
export type treeStates = 'idle' | 'startPathing' | 'finishPathing'|
    'startStateFiltering' | 'finishStateFiltering' |
    'startBranching' |'finishBranching'
type IGetBranches = (props: IGetBranchesProps) => {
    treeData: TreeDataNode[]
    objectAttributeIds: number[]
}
type IGetCurrentPathBranch = (props: {
    path: string
    // viewParams: ReturnType<typeof getStateViewParamsWithStereotype>
    currentTree: TreeDataNode[]
    currentNodeProps: {
        handleActiveOAid: IManageMetricsReturn['methods']['handleActiveOAid']
        activeIds: TObjectWithOAAttributesSet
    }
    // updateNode: (props: {
    //     id: number, 
    //     refObject: HTMLElement
    //     stereoId: number
    // }) => void
    // fill: string
    containerWidth?: number
    setStatus?: (status: TBranchingStatus) => void
}) => TreeDataNode[]
interface IGetBranchesProps {
    objectIds: IOATreeState['objectIds']
    stateIdsFilter: IOATreeState['stateIdsFilter']
    linkedClasses: IWidgetCenterAnalysisMetricsFormProps['classes']
    nodeProps: {
        handleActiveOAid: IManageMetricsReturn['methods']['handleActiveOAid']
        activeIds: TObjectWithOAAttributesSet
        // activeIds: TObjectAttributesSet
    }
}

export const isActive = (arr: number[], id: number) => {
    return arr.includes(id)
}

export const makeKey = (key: string, count: number, idx: number | string) => {
    const pos = '0'.repeat(count).split('').join('-')

    return `${key}-${pos ? pos + '-' + idx : idx}`
}

type TGetChildrenBranches = (props: {
    currentObject: IObject
    // currentTempTree: TreeNodeProps
    currentRootObjectTempTree: TreeDataNode[]
    objectAttributeIds: number[]
    stateIdsFilter: IOATreeState['stateIdsFilter']
    childrenClasses: {
        target: number[]
        linking: number[]
    }
}) => void

export const createObjectsTreeData: IGetBranches = ({
    objectIds,
    linkedClasses,
    nodeProps,
    stateIdsFilter
}) => {
    const objectAttributeIds: number[] = []
    const tempTree: TreeDataNode[] = []
    const allClasses = useClassesStore.getState().store.data
    const measurableClasses = allClasses.reduce((acc, cls) => {
        if (cls.package_id === PACKAGE_AREA.SUBJECT) {
            const classMeasurableAttrs = cls.attributes
                ?.filter(attr => attr.history_to_cache || attr.history_to_db) ?? []
            
            if (classMeasurableAttrs.length > 0) {
                if (cls.id in acc) {
                    // 
                } else {
                    acc[cls.id] = classMeasurableAttrs
                }
            }

        }

        return acc
    }, {})

    const checkStereoState = (state: IState) => {
        if (stateIdsFilter.length > 0) {
            // Если нет состояния и данный тип выбран в селекте стерео состояний
            if (!state && stateIdsFilter.includes(0)) {
                // console.log('stereo', state?.id, state?.state_stereotype_id)

                return true
            // Если данный тип состояния выбран в селекте стерео состояний 
            // (не важно, если состояние undefined, оно отсеется)
            } else {
                return stateIdsFilter.includes(state?.state_stereotype_id)
            }
        // Абсолютно все состояния
        } else {
            return true
        }
    }

    const getMeasurableOAttrsBranches = (obj: IObject, key: string): TreeDataNode[] => {
        // const length = key.split('_').length
        // console.log(obj.name, key, length)            
        const OAttrsNodes: TreeDataNode[] = (obj.object_attributes ?? [])
            .map(oa => oa)
            .sort((a, b) => a.attribute.name.localeCompare(b.attribute.name))
            .reduce((acc, oa) => {
                const oaIdx = measurableClasses[obj.class_id]
                    ?.findIndex(attr => {
                        return attr.id === oa.attribute_id
                    })
                
                if (oaIdx && oaIdx > -1) {
                    const currentOAStateEntity = useStateEntitiesStore
                        .getState().getAttributeStateEntityById(oa.id)
                    
                    const currentOAState = useStatesStore
                        .getState().getStateById(currentOAStateEntity?.state)
                    
                    // console.log('oa', oa.attribute.name, currentOAState?.id, currentOAState?.state_stereotype_id)

                    if (checkStereoState(currentOAState)) {
                        objectAttributeIds.push(oa.id)
                        const viewParams = getStateViewParamsWithStereotype(currentOAState, true)
    
                        // console.log('oa key', `${key}_${oa.id}`)
                        acc.push({
                            key: `${key}_${oa.id}`,
                            // key: `${currentObject.name}-${child.name}-${oa.id}`,
                            title: (
                                <OATreeCustomNode 
                                // <OATreeCustomNodeMemo 
                                    id={oa.id}
                                    objectId={obj.id}
                                    classId={obj.class_id}
                                    name={oa.attribute.name}
                                    handleActiveOAid={nodeProps.handleActiveOAid}
                                    graphActiveIds={nodeProps.activeIds.graph}
                                    multigraphActiveIds={nodeProps.activeIds.multigraph}
                                    viewParams={viewParams}
                                />
                            )
                        })

                    }
                }

                return acc
            }, []) 

        return OAttrsNodes
    }
    const getChildrenObjectsBranches: TGetChildrenBranches = ({
        currentObject,
        // objectAttributeIds,
        currentRootObjectTempTree,
        childrenClasses,
        // stateIdsFilter
    }) => {
        const childrenObjects = findChildObjectsWithPaths({
            currentObj: currentObject,
            childClassIds: childrenClasses.linking,
            targetClassIds: childrenClasses.target, 
        }).objectsWithPath

        childrenObjects.forEach((child) => {
            let currentChildKey = `${currentObject.id}` 
            let childrenTreeBranch: TreeDataNode[] = currentRootObjectTempTree

            child.paths.allArr.forEach((path, pathIdx) => {
                currentChildKey = `${currentChildKey}_${path.id}`
                
                const childPathTreeIdx = childrenTreeBranch.findIndex(item => item.key === currentChildKey)
                const pathObject = useObjectsStore.getState().getByIndex('id', path.id)
                const pathObjectOAttrsBranches = getMeasurableOAttrsBranches(pathObject, currentChildKey)

                if (childPathTreeIdx > -1) {

                    if (pathIdx !== child.paths.allArr.length - 1) {
                        childrenTreeBranch = childrenTreeBranch[childPathTreeIdx].children
                    }

                } else {
                    const currentObjectStateEntity = useStateEntitiesStore
                        .getState().getObjectStateEntityById(child.id)
                    const currentObjectState = useStatesStore
                        .getState().getStateById(currentObjectStateEntity?.state)

                    // console.log('pathObject', pathObject.name, 
                    //     currentObjectState?.id, currentObjectState?.state_stereotype_id)

                    // if (checkStereoState(currentObjectState)) {
                    const viewParams = getStateViewParamsWithStereotype(currentObjectState, true)

                    childrenTreeBranch.push({
                        key: currentChildKey,
                        title: (
                            <OATreeCustomTitle 
                                title={`${path.name} [${path.id}]`} 
                                viewParams={viewParams}
                            />
                        ),
                        children: [...pathObjectOAttrsBranches]
                    })
                    // }

                    
                    if (pathIdx !== child.paths.allArr.length - 1) {
                        childrenTreeBranch = childrenTreeBranch[childrenTreeBranch.length - 1].children
                    }
                }    
                
                if (pathIdx === child.paths.allArr.length - 1) {
                    const lastObject = useObjectsStore.getState().getByIndex('id', path.id)
                    
                    const OAttrsNodes: TreeDataNode[] = getMeasurableOAttrsBranches(lastObject, currentChildKey)
                    
                    childrenTreeBranch = [...childrenTreeBranch, ...OAttrsNodes]
                }
            })
        })
    }
    
    objectIds.forEach((objectId) => {
        const currentObject = useObjectsStore.getState().getByIndex('id', objectId)
        const currentObjectStateEntity = useStateEntitiesStore.getState().getObjectStateEntityById(objectId)
        const currentObjectState = useStatesStore.getState().getStateById(currentObjectStateEntity?.state)
        
        const viewParams = getStateViewParamsWithStereotype(currentObjectState, true)
        
        tempTree.push({
            key: currentObject.id,
            title: (
                <OATreeCustomTitle 
                    title={currentObject.name} 
                    viewParams={viewParams}
                />
            ),
            children: []
        })

        const currentIdx = tempTree.findIndex(item => item.key === objectId)

        

        if ([
            linkedClasses,
            Array.isArray(linkedClasses), 
            linkedClasses?.length > 0,
            (
                // linkedClasses[0]?.linking?.length > 0 &&
                linkedClasses?.[0]?.target?.length > 0
            )
        ].every(Boolean)) {
            linkedClasses.forEach(linkedCls => {
                getChildrenObjectsBranches({
                    childrenClasses: {
                        linking: linkedCls.linking,
                        target: linkedCls.target,
                    },
                    currentObject,
                    objectAttributeIds,
                    currentRootObjectTempTree: tempTree[currentIdx].children,
                    stateIdsFilter
                })
            }) 
        } else {
            getChildrenObjectsBranches({
                childrenClasses: {
                    linking: allClasses.map(cls => cls.id),
                    target: Object.keys(measurableClasses).map(cls => Number(cls)), 
                },
                currentObject,
                objectAttributeIds,
                currentRootObjectTempTree: tempTree[currentIdx].children,
                stateIdsFilter
            }) 
            
        }
        
    })
    
    return {
        treeData: tempTree,
        objectAttributeIds
    }
}

export const getOAStateStereoId = (oaId: number) => {
    const currentOAStateEntity = useStateEntitiesStore
        .getState().getAttributeStateEntityById(oaId)
    
    const currentOAState = useStatesStore
        .getState().getStateById(currentOAStateEntity?.state)

    return currentOAState?.state_stereotype_id ?? 0
}

export const extractOAidFromPath = (path: string) => {
    const oaId = path.split('.').at(-1).split('oa')[1]

    return Number(oaId)
}

const titleContainerPadding = 4 * 2
const expandIconWidth = 13
const graphIconWidth = 24
const graphIconsGap = 12
const treeContainerPadding = 20
const attrValueLabelWidth = 100

export const getOAChartViewTypeValue = (oa: IObjectAttribute) => {
    const oaValue = oa.attribute_value
    const currentValue = oaValue && oaValue !== 'undefined'
        ? oaValue 
        : ''
    const oaUnit = oa.attribute?.unit
    const currentUnit = oaUnit?.length > 0 
        ? `${oaUnit}` 
        : ''
    const params = oa.attribute.view_type?.params
    // Если есть params, то парсим value_converter
    const value_converter = params && JSON.parse(params)?.value_converter
    // Если value_converter есть, то ищем конкретный source
    const currentSource = value_converter?.find(item => item.source === currentValue)
    // Присваиваем текущее значения в зависимости от наличия value_converter у неё
    const parsedCurrentValue = value_converter 
        ? currentSource?.converted
        : currentValue 
            ? `${currentValue} ${currentUnit}`
            : ''
    
    return parsedCurrentValue
}

export const getBranch: IGetCurrentPathBranch = ({
    path,
    // viewParams,
    currentNodeProps,
    currentTree,
    // updateNode,
    // fill,
    setStatus,
    containerWidth
}) => {
    const currentIds = path.split('.')
    let currentTreeBranch = currentTree
    // titleWidth = ширина контейнера -  - паддинг контейнера
    const titleWidth = containerWidth - treeContainerPadding - titleContainerPadding
    const nodeWidth = titleWidth + expandIconWidth - 
        (titleContainerPadding + graphIconWidth * 2 + attrValueLabelWidth) - graphIconsGap * 2 - 5

    // console.log('currentIds', currentIds)
    currentIds.forEach((id, idx) => { 
        const currentObject = useObjectsStore.getState().getByIndex('id', Number(id))
        const currentKey = currentIds.slice(0, idx + 1).join('.')
        const [objectId, oaId] =  path.split('.').at(-1).split('oa').map(id => Number(id))
        let classId: number, currentClass: IClass

        if (id.includes('cls')) {
            classId = Number(id.replace('cls', ''))
            currentClass = useClassesStore.getState().getByIndex('id', classId)
        } 
        // let classId: number, objectId: number, oaId: number

        // if (idsArr.length === 3) {
        //     [classId, objectId, oaId] = idsArr
        // } else {
        //     [objectId, oaId] = idsArr
        // }


        // const oaId = id.includes('oa')
        //     ? Number(id.replace('oa', ''))
        //     : undefined

        const currentOAttr = useObjectsStore.getState().getMeasurableObjectAttribute(objectId, oaId)

        if (!['chart', 'default'].includes(currentOAttr?.attribute?.view_type?.type)) {
            return
        }

        const currentOAttrValue = (['chart', 'default'].includes(currentOAttr?.attribute?.view_type?.type) &&
            ['string', 'integer', 'double'].includes(currentOAttr?.attribute?.data_type?.inner_type)
        )
            ? getOAChartViewTypeValue(currentOAttr) ?? ''
            : ''

        if ([94507].includes(oaId)) {
        // if ([94501, 94502].includes(oaId)) {
        // if ([238875].includes(oaId)) {
            // console.log('currentOAttr', currentOAttr)
            // console.log('currentOAttrValue', currentOAttrValue)
        }
        // const currentOAttr = useObjectsStore.getState().getMeasurableObjectAttribute(
        //     Number(currentIds[idx - 1]),
        //     oaId
        // )

        // console.log('currentOAttr', currentOAttr)
        const treeIdx = currentTreeBranch.findIndex(item => {
            return item.key === currentKey
        })

        if (treeIdx > -1) {
            if (idx !== currentIds.length - 1) {
                currentTreeBranch = currentTreeBranch[treeIdx].children
            }
        } else {
            currentTreeBranch.push({
                key: currentKey,
                title: id.includes('oa')
                    ? (
                        <OATreeCustomNodeMemoized 
                            id={oaId}
                            objectId={currentOAttr.object_id}
                            graphActiveIds={currentNodeProps?.activeIds.graph}
                            multigraphActiveIds={currentNodeProps?.activeIds.multigraph}
                            handleActiveOAid={currentNodeProps?.handleActiveOAid}
                            name={currentOAttr?.attribute.name}
                            attrValue={currentOAttrValue}
                            // вычитаем количество вложенных колонок + стрелочка перед тайтлом
                            nodeWidth={nodeWidth - expandIconWidth * (idx + 1)}
                            visualSettings={{}}
                        />
                    )
                    : id.includes('cls')
                        ? (
                            <OATreeCustomTitleMemoized
                                id={0}
                                title={currentClass.name ?? 'Без привязки'}
                                // вычитаем количество вложенных колонок
                                titleWidth={titleWidth - expandIconWidth * (idx + 1)}
                                visualSettings={{}}
                                isClass
                            />
                        ) : (
                            <OATreeCustomTitleMemoized
                                id={currentObject?.id ?? objectId}
                                title={currentObject?.name ?? 'Без привязки'}
                                // вычитаем количество вложенных колонок
                                titleWidth={titleWidth - expandIconWidth * (idx + 1)}
                                visualSettings={{}}
                            />
                        ),
                children: []
            })

            if (idx !== currentIds.length - 1) {
                currentTreeBranch = currentTreeBranch[currentTreeBranch.length - 1].children
            }
        }

        if (idx === currentIds.length - 1) {
            currentTreeBranch = [
                ...currentTreeBranch, 
                {
                    key: currentKey,
                    title: id.includes('oa')
                        ? (
                            <OATreeCustomNodeMemoized 
                                id={oaId}
                                objectId={currentOAttr.object_id}
                                graphActiveIds={currentNodeProps?.activeIds.graph}
                                multigraphActiveIds={currentNodeProps?.activeIds.multigraph}
                                handleActiveOAid={currentNodeProps?.handleActiveOAid}
                                name={currentOAttr?.attribute.name}
                                attrValue={currentOAttrValue}
                                // вычитаем количество вложенных колонок + стрелочка перед тайтлом
                                nodeWidth={nodeWidth - expandIconWidth * (idx + 1)}
                                visualSettings={{}}
                            />
                        )
                        : id.includes('cls')
                            ? (
                                <OATreeCustomTitleMemoized
                                    id={0}
                                    title={currentClass.name ?? 'Без привязки'}
                                    // вычитаем количество вложенных колонок
                                    titleWidth={titleWidth - expandIconWidth * (idx + 1)}
                                    visualSettings={{}}
                                    isClass
                                />
                            ) : (
                                <OATreeCustomTitleMemoized 
                                    id={currentObject?.id ?? objectId}
                                    title={currentObject?.name ?? 'Без привязки'}
                                    // вычитаем количество вложенных колонок
                                    titleWidth={titleWidth - expandIconWidth * (idx + 1)}
                                    visualSettings={{}}
                                />
                            ),
                }]
        }
    })

    if (setStatus) {
        setStatus('finished')
    }

    return currentTree
}
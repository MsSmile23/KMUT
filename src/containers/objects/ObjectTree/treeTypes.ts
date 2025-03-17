import { IObjectsStore } from '@shared/stores/objects'
import { IClass } from '@shared/types/classes'
import { IObject } from '@shared/types/objects'
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { IAccumState } from '@shared/utils/states'
import { DataNode } from 'antd/es/tree'
import { FieldDataNode } from 'rc-tree/lib/interface'
import { CSSProperties } from 'react'

export interface ITrackedClass {
    id: IClass['id']
    name: IClass['name']
}
export interface ITreeProps {
    id?: number
    classIds?: ITrackedClass[]
    intermediateClassIds?: ITrackedClass[]
    parentTrackedClasses?: ITrackedClass[]
    trackId?: 'none' | 'lastOpened'
}
export interface IFormProps {
    id: string
    name: string
}
export interface ITreeStoreProperties {
    lastTrackedObjectId?: IObject['id'] | null
    groupingOrder?: IFormProps[]
    visibleClassIds?: IFormProps[]
    intermediateClassIds?: IFormProps[]
    classifiers?: Record<string, IClassifier>
    searchValue: string
    stateType: string
    showHierarchy: boolean,
}

export type TTreePropWithId<T> = Record<string, T>
export interface ITreeObjectFilterItem {
    target: ITrackedClass[],
    linking: ITrackedClass[]
}
export interface ITreeFilterObjectSetProps {
    value: ITreeObjectFilterItem, 
    type: keyof ITreeObjectFilterItem, 
    idx: number, 
    id: number
}
type TStatePartName = keyof ITreeStore

export interface ITreeStore {
    chosenClassifiers: TTreePropWithId<IClassifiersProps['classifiers']>
    setChosenClassifiers: (value: IClassifiersProps['classifiers'], id: number) => void
    chosenClassifiersCount: TTreePropWithId<number>
    setChosenClassifiersCount: (count: number, id: number) => void
    groupingOrder: TTreePropWithId<ITreeStoreProperties['groupingOrder']>
    setGroupingOrder: (value: ITreeStoreProperties['groupingOrder'], id: number) => void
    searchValue: TTreePropWithId<ITreeStoreProperties['searchValue']>
    setSearchValue: (value: ITreeStoreProperties['searchValue'], id: number) => void
    lastTrackedObjectId: ITreeStoreProperties['lastTrackedObjectId']
    setLastTrackedObjectId: (value: ITreeStoreProperties['lastTrackedObjectId']) => void
    clearSettings: (id: number) => void
    getStatePart: (state: TStatePartName, id: number) => any
    expandedKeys: TTreePropWithId<string[]>,
    setExpandedKeys: (value: string[], id: number) => void
    classIds?: TTreePropWithId<ITrackedClass[]>
    setClassIds: (value: ITreeProps['classIds'], id: number) => void
    visibleClassIds: TTreePropWithId<ITreeStoreProperties['visibleClassIds']>
    setVisibleClassIds: (value: ITreeStoreProperties['visibleClassIds'], id: number) => void
    intermediateClassIds: TTreePropWithId<ITreeStoreProperties['intermediateClassIds']>
    setIntermediateClassIds: (value: ITreeStoreProperties['intermediateClassIds'], id: number) => void
    parentTrackedClasses?: TTreePropWithId<ITrackedClass[]>
    setParentTrackedClasses: (value: ITreeProps['parentTrackedClasses'], id: number) => void
    trackId?: TTreePropWithId<'none' | 'lastOpened'>
    setTrackID: (value: ITreeProps['trackId'], id: number) => void
    showHierarchy: TTreePropWithId<boolean>,
    setShowHierarchy: (value: boolean, id: number) => void
    treeObjectFilter?: TTreePropWithId<ITreeObjectFilterItem[]>
    setAllTreeObjectFilter?: (value: ITreeObjectFilterItem[], id: number) => void
    setEmptyTreeObjectFilter?: (id: number) => void
    saveSettingsToAccount?: (value: any, id: number) => void

    // Список отслеживаемых классоы (для дерева v2)
    trackedParentClassesids: number[];
    setTrackedParentClassesids: (ids: number[]) => void;
}

// Расширенный тип для DataNode
export type TExtendedDataNode = FieldDataNode<{
    key: string | number;
    title?: React.ReactNode | ((data: DataNode) => React.ReactNode);
    group?: string
    states?: {
        state: IAccumState,
        count: number
    }[]
}> 

export interface ITreeState {
    availableClassifiers: IClassifiersProps['classifiers']
    defaultTree: TExtendedDataNode[]
    customTree: TExtendedDataNode[]
}

export interface IClassifier {
    id: number
    name: string | number
    children: {
        id: number
        name: string
        class_id?: number
        state_id?: number | null
    }[]
}

export type ICreateBranch = (params: {
    id: number
    groupIdx: number
    temp: TExtendedDataNode[]
    currTitle: string
    groupName: string
    key: string
    index: number
    objName: string
    objId: number
    objState: IAccumState
}) => any

export interface IBuildBranchesProps {
    id: number
    key: string
    objectIndex?: number
    tempTree: TExtendedDataNode[]
    allClassifiers: IClassifiersProps['classifiers']
    groupingOrder: ITreeStoreProperties['groupingOrder']
    objectState: IAccumState
    object: IObject
    // getLinkById: ILinksStore['getLinkById']
    selectCurrObject: IObjectsStore['getByIndex']
    showHierarchy?: boolean
    themeStyles?: CSSProperties
}

export type IBuildBranches = (props: IBuildBranchesProps) => any

export interface ICustomTreeNode {
    name: string,
    icon: IECIconView['icon'],
    id: number,
    state?: IAccumState | undefined
    styles?: CSSProperties
}
export interface ITreeObjectsStatesProps {
    id: number | string 
    statuses: {
        state: IAccumState
        count: number
    }[]
    groupTitle?: string
    title?: string
    icon?: IECIconView['icon'],
    color?: string
    styles?: CSSProperties
}

export interface IClassifiersProps {
    classifiers: Record<string, IClassifier>
}

export interface ITreeModalProps {
    closeModal: () => void
}

export interface ITreeFilteringProps extends IClassifiersProps {
    id?: number
}

export interface ITreeFilteringModalProps extends ITreeFilteringProps, ITreeModalProps {}

export interface ITreeGroupingProps extends IClassifiersProps {
    id?: number
}

export interface ITreeGroupingModalProps extends ITreeGroupingProps, ITreeModalProps {}

export interface IDndGroupListProps {
    dragOrder: ITreeStoreProperties['groupingOrder']
    setOrder: (order: ITreeStoreProperties['groupingOrder']) => void
}
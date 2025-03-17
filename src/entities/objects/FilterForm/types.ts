import { IGetFormState } from '@containers/widgets/WidgetObjectTree/WidgetObjectTreeForm'
import { IAttribute } from '@shared/types/attributes'
import { IRelation } from '@shared/types/relations'
import { IStateEntities } from '@shared/types/state-entities'

export interface IExtendedFilterFormProps {
    getFormState?: IGetFormState<IFilterFormProps>
    widgetId?: string
    settings: IFilterFormProps
}
export interface IOption {
    label: string
    value: number | string
}
export interface IOptionList {
    title: number
    label: string
    options: IOption[]
}
export interface ICascaderOptionList {
    value: number | string
    label: string
    children?: ICascaderOptionList[]
}

export interface IAttributeFilterItem {
    currentAttr: number
    attrValue: IAttribute['data_type']['inner_type']
}
export interface IRelationFilterItem {
    type: IRelation['relation_type']
    stereoId: IRelation['relation_stereotype_id']
    id: number 
    objectIds: number[]
}
export interface IFilterFormProps {
    classFilter: {
        classIds: number[]
        stereotypeClassIds: number[]
        abstractClassIds: number[]
    }
    attrFilter: IAttributeFilterItem[]
    objectFilter: {
        objectIds: number[]
    }
    stateFilter: {
        stateType: keyof IStateEntities
        stateStereotypeIds: number[]
        stateMachineIds: number[]
        stateIds: number[]
    }
    relationFilter: IRelationFilterItem[]
}
import { IAttribute } from './attributes'
import { IClass } from './classes'
import { IObjectAttribute } from './objects'
import { IStateMachine } from './state-machines'


export interface IState {
    id?: number
    name?: string
    view_params: IViewParams
    object_attributes?: number[]
    objects?: number[]
    state_machine_id?: number
    state_section_id?: number
    state_machine?: IStateMachine
    rules_tree?: IRulesTree
    rule_group_id?: number
    priority?: number
    mnemo?: string
    is_entry_state?: boolean
    parent_state_id?: number | string,
    state_stereotype_id?: number
    state_stereotype?: IViewParams & {
        mnemo?: string
        priority?: number
    }
}
export interface IStates {
    object_states?: IState[]
    attribute_states?: IState[]
    id?: number
    name?: string
    classes?: IClass[]
    attributes?: IAttribute[]
    states?: IState[]

}

export interface IParams {
    type?: string
    value?: string
}
export interface IViewParams {
    name: string
    params: IParams[]
}
export interface IStatePost {
    id: number,
    view_params: IViewParams,
    object_attributes: IObjectAttributes[],
    objects: [],
    rule_group_id: number,
    rules_tree: IRulesTree []
}

export interface IRulesTree {
    path: string,
    parent_id: number,
    depth: number,
    is_leaf: boolean,
    group_operand: 'and' | 'or',
    rule_attributes: IRule[],
    rule_classes: IRule [],

}

export interface IRule {
    id: number,
    rule_group_id: number,
    entity_type: 'attribute' | 'class',
    attribute_id?: number,
    class_id?: number,
    operator: boolean,
    state_ids: string,
    min: number
}


export interface IObjectAttributes extends Partial<IObjectAttribute> {
    id: number,
}

export interface ISyslog {
    id: number
    msg: string | null
    hostname: string | null
    fromhost: string | null
    fromhost_ip: string | null
    programname: string | null
    syslogfacility: number | null
    syslogfacility_text: string | null
    syslogseverity: number | null
    syslogseverity_text: string | null
    pri: number | null
    pri_text: string | null
    timegenerated: string | null
    timereported: string | null
    app_name: string | null
    syslogtag: string | null
}
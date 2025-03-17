import { IAttribute } from './attributes'
import { IClass } from './classes'
import { IState } from './states'

export interface IStateMachine {
    id: number
    name: string | number
    attributes: IAttribute[]
    classes: IClass[]
    states: IState[]
    state_transitions: IStateMachineTransition[]
    is_attribute?: boolean

}

export interface IStateMachinePost {
    name: string | number
    attributes: number[]
    classes: number[]
    is_attribute?: boolean
}

export interface IStateMachineTransition{
    state_machine_id: number
    source_state_id: number, 
    target_state_id: number
}
export interface IStateMachineTransitionsPost {
    state_transitions: {
        source_state_id: number, 
        target_state_id: number
    }[]
}
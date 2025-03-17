import { IState } from './states'


export interface IStateSection {

    id: number | null,
    parent_state_id: number | null,
    parent_state: IState | object,
    states: IState[] | []
}
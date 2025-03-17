import { IState, IViewParams } from './states'

export interface IStateStereotype {
    id: number
    mnemo: string
    view_params: IViewParams
    states: IState[]
}
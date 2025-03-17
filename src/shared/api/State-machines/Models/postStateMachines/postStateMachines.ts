import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_MACHINES_SCHEME } from '../../settings'
import { IStateMachine, IStateMachinePost } from '@shared/types/state-machines'



export const postStateMachines = async (payload: IStateMachinePost):
    Promise<IApiReturn<Partial<IStateMachine> | undefined>> => {
    const response = await API.apiQuery<Partial<IStateMachine> | undefined>({
        method: API_STATE_MACHINES_SCHEME.postStateMachines.method,
        url: API_STATE_MACHINES_SCHEME.postStateMachines.url,
        data: payload,
    })

    return {
        ...response,
    }
}
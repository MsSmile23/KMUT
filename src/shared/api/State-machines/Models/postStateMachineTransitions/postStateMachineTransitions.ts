import { IApiReturn, API } from '@shared/lib/ApiSPA'
import {  IStateMachineTransition, IStateMachineTransitionsPost,  } from '@shared/types/state-machines'
import { API_STATE_MACHINES_SCHEME } from '../../settings'

export const postStateMachineTransitions = async (
    id: string,
    payload:  IStateMachineTransitionsPost
): Promise<IApiReturn<IStateMachineTransition | undefined>> => {
    const url = API_STATE_MACHINES_SCHEME.postStateMachineTransitions.url.replace(':id', id)

    const response = await API.apiQuery<IStateMachineTransition>({
        method: API_STATE_MACHINES_SCHEME.postStateMachineTransitions.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_MACHINES_SCHEME } from '../../settings'
import { IStateMachine } from '@shared/types/state-machines'

export const getStateMachineById = async (id: string | number): Promise<IApiReturn<IStateMachine | undefined>> => {
    const url = API_STATE_MACHINES_SCHEME.getStateMachineById.url.replace(':id', String(id))
    const response = await API.apiQuery<IStateMachine>({
        method: API_STATE_MACHINES_SCHEME.getStateMachineById.method,
        url: url,
    })

    return {
        ...response,
    }
}
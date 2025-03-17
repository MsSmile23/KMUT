import { IStates } from '@shared/types/states'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_MACHINES_SCHEME } from '../../settings'
import { IStateMachinePost } from '@shared/types/state-machines'


export const putStateMachineById = async (
    id: string,
    payload: IStateMachinePost
): Promise<IApiReturn<IStates | undefined>> => {
    const url = API_STATE_MACHINES_SCHEME.putStateMachineById.url.replace(':id', id)

    const response = await API.apiQuery<IStates>({
        method: API_STATE_MACHINES_SCHEME.putStateMachineById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
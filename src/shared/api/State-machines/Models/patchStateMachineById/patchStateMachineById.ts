import { IStateMachinePost } from '@shared/types/state-machines'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_MACHINES_SCHEME } from '../../settings'
import { IStates } from '@shared/types/states'


export const patchStateMachineById = async (
    id: string,
    payload: IStateMachinePost
): Promise<IApiReturn<IStates | undefined>> => {
    const url = API_STATE_MACHINES_SCHEME.patchStateMachineById.url.replace(':id', id)

    const response = await API.apiQuery<IStates>({
        method: API_STATE_MACHINES_SCHEME.patchStateMachineById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
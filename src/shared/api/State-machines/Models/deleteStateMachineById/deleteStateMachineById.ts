import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_MACHINES_SCHEME } from '../../settings'

export const deleteStateMachineById = async (id: number): Promise<IApiReturn<any | undefined>> => {
    const url = API_STATE_MACHINES_SCHEME.deleteStateMachineById.url.replace(':id', `${id}`)

    return API.apiQuery<any>({
        method: API_STATE_MACHINES_SCHEME.deleteStateMachineById.method,
        url: url
    })
}
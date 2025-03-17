import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATES_SCHEME } from '../../settings'


export const deleteStateById = async (id: number): Promise<IApiReturn<any | undefined>> => {
    const url = API_STATES_SCHEME.deleteStateById.url.replace(':id', `${id}`)

    return API.apiQuery<any>({
        method: API_STATES_SCHEME.deleteStateById.method,
        url: url
    })
}
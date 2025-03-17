import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'

export const deleteObjectById = async (id: number): Promise<IApiReturn<any | undefined>> => {
    const url = API_OBJECTS_SCHEME.deleteObjectById.url.replace(':id', `${id}`)

    return API.apiQuery<any>({
        method: API_OBJECTS_SCHEME.deleteObjectById.method,
        url: url
    })
}
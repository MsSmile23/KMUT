import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'

export const getFilteredObjects = async (payload): Promise<IApiReturn<any | undefined>> => {
    const url = API_OBJECTS_SCHEME.getFilteredObjects.url

    return API.apiQuery<any>({
        method: API_OBJECTS_SCHEME.getFilteredObjects.method,
        url: url,
        data: payload
    })
}
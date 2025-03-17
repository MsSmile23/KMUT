import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'
import { IObject } from '@shared/types/objects';

export const getObjectsStatuses = async (payload): Promise<IApiReturn<IObject | undefined>> => {
    const url = API_OBJECTS_SCHEME.getObjectsStatuses.url
    const response = await API.apiQuery<IObject>({
        method: API_OBJECTS_SCHEME.getObjectsStatuses.method,
        url: url,
        data: payload
    })

    return {
        ...response,
    }
}
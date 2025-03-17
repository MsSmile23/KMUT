import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IObjectPost, IObject } from '../../../../types/objects'
import { API_OBJECTS_SCHEME } from '../../../Objects/settings'

export const postObjects = async (payload: IObjectPost): Promise<IApiReturn<IObject | undefined>> => {
    const response = await API.apiQuery<IObject>({
        method: API_OBJECTS_SCHEME.postObjects.method,
        url: API_OBJECTS_SCHEME.postObjects.url,
        data: payload,
    })

    return {
        ...response,
    }
}
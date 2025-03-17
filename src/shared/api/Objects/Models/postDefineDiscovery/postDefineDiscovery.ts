import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IObject } from '../../../../types/objects'
import { API_OBJECTS_SCHEME } from '../../../Objects/settings'

interface IPostDefineDiscovery {
    class_id: number
    object_id: number
}

export const postDefineDiscovery = async (payload: IPostDefineDiscovery): Promise<IApiReturn<IObject | undefined>> => {
    return API.apiQuery<IObject>({
        method: API_OBJECTS_SCHEME.postDefineDiscovery.method,
        url: API_OBJECTS_SCHEME.postDefineDiscovery.url,
        data: payload,
    })
}
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IObject } from '../../../../types/objects'
import { API_OBJECTS_SCHEME } from '../../../Objects/settings'


interface ILocalPayload {
    class_id: number,
    count: number,
}
export const createManyObjects = async (payload: ILocalPayload): Promise<IApiReturn<IObject[] | undefined>> => {
    const response = await API.apiQuery<IObject[]>({
        method: API_OBJECTS_SCHEME.createManyObjects.method,
        url: API_OBJECTS_SCHEME.createManyObjects.url,
        data: payload,
    })

    return {
        ...response,
    }
}
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'
import { IObject } from '@shared/types/objects'

export const getObjectsByClassId = async (
    payload: Record<string, string | number | boolean> = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IObject[] | undefined>> => {
    const url = API_OBJECTS_SCHEME.getObjectsByClassId.url
    const response = await API.apiGetAsArray<IObject[]>({
        endpoint: {
            method: API_OBJECTS_SCHEME.getObjectById.method,
            url: url,
        },
        payload,
    })

    return {
        ...response,
    }
}
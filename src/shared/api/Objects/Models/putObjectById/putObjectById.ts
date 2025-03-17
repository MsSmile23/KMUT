import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IObjectPost, IObject } from '../../../../types/objects'
import { API_OBJECTS_SCHEME } from '../../../Objects/settings'

export const putObjectById = async (
    id: string,
    payload: IObjectPost
): Promise<IApiReturn<IObject | undefined>> => {
    const url = API_OBJECTS_SCHEME.putObjectById.url.replace(':id', id)

    const response = await API.apiQuery<IObject>({
        method: API_OBJECTS_SCHEME.putObjectById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
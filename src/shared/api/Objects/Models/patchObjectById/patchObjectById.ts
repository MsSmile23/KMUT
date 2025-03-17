import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IObject } from '../../../../types/objects'
import { API_OBJECTS_SCHEME } from '../../../Objects/settings'

export const patchObjectById = async (
    id: string,
    payload: IObject
): Promise<IApiReturn<IObject | undefined>> => {
    const url = API_OBJECTS_SCHEME.patchObjectById.url.replace(':id', id)

    const response = await API.apiQuery<IObject>({
        method: API_OBJECTS_SCHEME.patchObjectById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttribute } from '../../../../types/attributes'
import { API_RELATIONS_SCHEME } from '../../settings'

export const deleteRelationById = async (
    id: string
): Promise<IApiReturn<IAttribute | undefined>> => {
    const url = API_RELATIONS_SCHEME.deleteRelationById.url.replace(':id', id)

    const response = await API.apiQuery<IAttribute>({
        method: API_RELATIONS_SCHEME.deleteRelationById.method,
        url: url,
    })

    return {
        ...response,
    }
}
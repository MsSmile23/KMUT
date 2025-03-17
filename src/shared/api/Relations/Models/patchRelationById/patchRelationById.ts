import { IRelation } from '@shared/types/relations'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttribute } from '../../../../types/attributes'
import { API_RELATIONS_SCHEME } from '../../settings'
import { TRelationPayload } from '../../types'

export const patchRelationById = async (
    id: string,
    payload: TRelationPayload
): Promise<IApiReturn<IAttribute | undefined>> => {
    const url = API_RELATIONS_SCHEME.patchRelationById.url.replace(':id', id)
    const response = await API.apiQuery<IRelation>({
        method: API_RELATIONS_SCHEME.patchRelationById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
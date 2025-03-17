import { IRelation } from '@shared/types/relations'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_RELATIONS_SCHEME } from '../../settings'
import { TRelationPayload } from '../../types'

export const postRelation = async (
    payload: TRelationPayload
): Promise<IApiReturn<IRelation | undefined>> => {
    const response = await API.apiQuery<IRelation>({
        method: API_RELATIONS_SCHEME.postRelation.method,
        url: API_RELATIONS_SCHEME.postRelation.url,
        data: payload,
    })

    return {
        ...response,
    }
}
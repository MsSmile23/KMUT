import { IRelation } from '@shared/types/relations'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_RELATIONS_SCHEME } from '../../settings'

export const getRelationById = async (
    id: string
): Promise<IApiReturn<IRelation | undefined>> => {
    const url = API_RELATIONS_SCHEME.getRelationById.url.replace(':id', id)
    
    const response = await API.apiQuery<IRelation>({
        method: API_RELATIONS_SCHEME.getRelationById.method,
        url: url,
    })

    return {
        ...response,
    }
}
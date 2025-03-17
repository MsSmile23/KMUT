import { IRelationStereotype } from '@shared/types/relation-stereotypes'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_RELATION_STEREOTYPES_SCHEME } from '../../settings'




export const getAttributeStereotypesById = async (
    id: string
): Promise<IApiReturn<IRelationStereotype | undefined>> => {
    const url = API_RELATION_STEREOTYPES_SCHEME.getRelationStereotypesById.url.replace(
        ':id',
        id
    )
    const response = await API.apiQuery<IRelationStereotype>({
        method: API_RELATION_STEREOTYPES_SCHEME.getRelationStereotypesById.method,
        url: url,
    })

    return {
        ...response,
    }
}
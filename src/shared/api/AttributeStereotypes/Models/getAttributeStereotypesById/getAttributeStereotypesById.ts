import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttributeStereotype } from '../../../../types/attribute-stereotypes'
import { API_ATTRIBUTE_STEREOTYPES_SCHEME } from '../../settings'

export const getAttributeStereotypesById = async (
    id: string
): Promise<IApiReturn<IAttributeStereotype | undefined>> => {
    const url = API_ATTRIBUTE_STEREOTYPES_SCHEME.getAttributeStereotypesById.url.replace(
        ':id',
        id
    )
    const response = await API.apiQuery<IAttributeStereotype>({
        method: API_ATTRIBUTE_STEREOTYPES_SCHEME.getAttributeStereotypesById.method,
        url: url,
    })

    return {
        ...response,
    }
}
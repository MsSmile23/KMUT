import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttribute } from '../../../../types/attributes'
import { API_ATTRIBUTE_SCHEME } from '../../settings'

export const getAttributeById = async (
    id: string
): Promise<IApiReturn<IAttribute | undefined>> => {
    const url = API_ATTRIBUTE_SCHEME.getAttributeById.url.replace(':id', id)
    
    const response = await API.apiQuery<IAttribute>({
        method: API_ATTRIBUTE_SCHEME.getAttributeById.method,
        url: url,
    })

    return {
        ...response,
    }
}
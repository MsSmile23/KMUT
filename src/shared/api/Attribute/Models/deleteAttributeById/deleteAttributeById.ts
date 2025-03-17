import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttribute } from '../../../../types/attributes'
import { API_ATTRIBUTE_SCHEME } from '../../../Attribute/settings'

export const deleteAttributeById = async (
    id: string
): Promise<IApiReturn<IAttribute | undefined>> => {
    const url = API_ATTRIBUTE_SCHEME.deleteAttributeById.url.replace(':id', id)

    const response = await API.apiQuery<IAttribute>({
        method: API_ATTRIBUTE_SCHEME.deleteAttributeById.method,
        url: url,
    })

    return {
        ...response,
    }
}
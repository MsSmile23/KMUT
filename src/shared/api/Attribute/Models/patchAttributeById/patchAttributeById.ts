import { API, IApiReturn } from '@shared/lib/ApiSPA'

import { IAttribute, IAttributePost } from '@shared/types/attributes'
import { API_ATTRIBUTE_SCHEME } from '@shared/api/Attribute/settings'

export const patchAttributeById = async (
    id: string,
    payload: IAttributePost
): Promise<IApiReturn<IAttribute | undefined>> => {
    const url = API_ATTRIBUTE_SCHEME.patchAttributeById.url.replace(':id', id)
    const response = await API.apiQuery<IAttribute>({
        method: API_ATTRIBUTE_SCHEME.patchAttributeById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
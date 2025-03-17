import { API, IApiReturn } from '@shared/lib/ApiSPA'

import { IAttribute, IAttributePost } from '@shared/types/attributes'
import { API_ATTRIBUTE_SCHEME } from '@shared/api/Attribute/settings'


export const postAttributes = async (
    payload: IAttributePost
): Promise<IApiReturn<IAttribute | undefined>> => {
    const response = await API.apiQuery<IAttribute>({
        method: API_ATTRIBUTE_SCHEME.postAttributes.method,
        url: API_ATTRIBUTE_SCHEME.postAttributes.url,
        data: payload,
    })

    return {
        ...response,
    }
}
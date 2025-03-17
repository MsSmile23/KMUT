import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttributesLinks } from '../../../../types/attributes'
import { API_ATTRIBUTE_SCHEME } from '../../settings'

export const updateAttributesLinks = async (
    payload: IAttributesLinks[]
): Promise<IApiReturn<IAttributesLinks[] | undefined>> => {
    const response = await API.apiQuery<IAttributesLinks[]>({
        method: API_ATTRIBUTE_SCHEME.updateAttributesLinks.method,
        url: API_ATTRIBUTE_SCHEME.updateAttributesLinks.url,
        data: { data: payload },
    })

    return {
        ...response,
    }
}
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IAttributeCategory } from '../../../../types/attribute-categories'
import { API_ATTRIBUTE_CATEGORIES_SCHEME } from '../../../AttributeCategories/settings'

export const getAttributeCategories = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IAttributeCategory[]>> => {
    const response = await API.apiGetAsArray<IAttributeCategory[]>({
        endpoint: { ...API_ATTRIBUTE_CATEGORIES_SCHEME.getAttributeCategories },
        payload,
    })

    return { ...response }
}
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttributeCategory } from '../../../../types/attribute-categories'
import { API_ATTRIBUTE_CATEGORIES_SCHEME } from '../../../AttributeCategories/settings'

export const postAttributeCategories = async (
    payload: IAttributeCategory
): Promise<IApiReturn<IAttributeCategory[] | undefined>> => {
    const response = await API.apiQuery<IAttributeCategory[]>({
        method: API_ATTRIBUTE_CATEGORIES_SCHEME.postAttributeCategories.method,
        url: API_ATTRIBUTE_CATEGORIES_SCHEME.postAttributeCategories.url,
        data: payload,
    })

    return {
        ...response,
    }
}
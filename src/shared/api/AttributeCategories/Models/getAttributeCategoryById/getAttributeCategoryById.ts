import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttributeCategory } from '../../../../types/attribute-categories'
import { API_ATTRIBUTE_CATEGORIES_SCHEME } from '../../settings'

export const getAttributeCategoryById = async (
    id: string
): Promise<IApiReturn<IAttributeCategory | undefined>> => {
    const url = API_ATTRIBUTE_CATEGORIES_SCHEME.getAttributeCategoryById.url.replace(
        ':id',
        id
    )
    const response = await API.apiQuery<IAttributeCategory>({
        method: API_ATTRIBUTE_CATEGORIES_SCHEME.getAttributeCategoryById.method,
        url: url,
    })

    return {
        ...response,
    }
}
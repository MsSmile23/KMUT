import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttributeCategory } from '../../../../types/attribute-categories'
import { API_ATTRIBUTE_CATEGORIES_SCHEME } from '../../../AttributeCategories/settings'

export const deleteAttributeCategoryById = async (
    id: string
): Promise<IApiReturn<IAttributeCategory | undefined>> => {
    const url = API_ATTRIBUTE_CATEGORIES_SCHEME.deleteAttributeCategoryById.url.replace(
        ':id',
        id
    )
    const response = await API.apiQuery<IAttributeCategory>({
        method: API_ATTRIBUTE_CATEGORIES_SCHEME.deleteAttributeCategoryById.method,
        url: url,
    })

    return {
        ...response,
    }
}
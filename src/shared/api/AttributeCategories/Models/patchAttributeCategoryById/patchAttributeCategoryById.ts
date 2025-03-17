import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAttributeCategory } from '../../../../types/attribute-categories'
import { API_ATTRIBUTE_CATEGORIES_SCHEME } from '../../../AttributeCategories/settings'

export const patchAttributeCategoryById = async (
    id: string,
    payload: IAttributeCategory
): Promise<IApiReturn<IAttributeCategory | undefined>> => {
    const url = API_ATTRIBUTE_CATEGORIES_SCHEME.patchAttributeCategoryById.url.replace(
        ':id',
        id
    )
    const response = await API.apiQuery<IAttributeCategory | undefined>({
        method: API_ATTRIBUTE_CATEGORIES_SCHEME.patchAttributeCategoryById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
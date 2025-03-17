import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IObjectAttribute } from '../../../../types/objects'
import { API_OBJECTS_SCHEME } from '../../settings'

export const patchObjectAttribute = async (
    objectAttributeId: number,
    payload: '1' | '0'
): Promise<IApiReturn<IObjectAttribute>> => {
    return API.apiQuery<IObjectAttribute>({
        method: 'PATCH',
        url: API_OBJECTS_SCHEME.patchObjectAttribute.url.replace(':id', `${objectAttributeId}`),
        data: { attribute_value: payload },
    })
}
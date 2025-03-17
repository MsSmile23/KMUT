import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { IObjectAttribute } from '../../../../types/objects'
import { API_OBJECTS_SCHEME } from '../../settings'

export const getObjectAttribute = async (objectAttributeId: number ): Promise<IApiReturn<IObjectAttribute>> => {
    return API.apiQuery<IObjectAttribute>({
        method: 'GET',
        url: API_OBJECTS_SCHEME.getObjectAttribute.url.replace(':id', `${objectAttributeId}`),
    })
}
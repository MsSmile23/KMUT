import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECT_ATTRIBUTES_SCHEME } from '../../settings'
import { IObjectAttribute } from '@shared/types/objects';

export const getObjectAttributeById = async (id: string | number): Promise<IApiReturn<
    IObjectAttribute | undefined
>> => {
    const url = API_OBJECT_ATTRIBUTES_SCHEME.getObjectAttributeById.url.replace(':id', String(id))
    const response = await API.apiQuery<IObjectAttribute>({
        method: API_OBJECT_ATTRIBUTES_SCHEME.getObjectAttributeById.method,
        url: url,
    })

    return {
        ...response,
    }
}
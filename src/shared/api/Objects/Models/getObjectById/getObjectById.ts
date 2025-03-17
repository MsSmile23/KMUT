import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'
import { IObject } from '@shared/types/objects';

export const getObjectById = async (id: string | number): Promise<IApiReturn<IObject | undefined>> => {
    const url = API_OBJECTS_SCHEME.getObjectById.url.replace(':id', String(id))
    const response = await API.apiQuery<IObject>({
        method: API_OBJECTS_SCHEME.getObjectById.method,
        url: url,
    })

    return {
        ...response,
    }
}
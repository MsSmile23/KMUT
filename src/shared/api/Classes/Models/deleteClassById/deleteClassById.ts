import { IClass } from '@shared/types/classes'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_CLASSES_SCHEME } from '../../settings'

export const deleteClassById = async (id: string): Promise<IApiReturn<IClass | undefined>> => {
    const url = API_CLASSES_SCHEME.deleteClassById.url.replace(':id', id)

    const response = await API.apiQuery<IClass>({
        method: API_CLASSES_SCHEME.deleteClassById.method,
        url: url,
    })

    return {
        ...response,
    }
}
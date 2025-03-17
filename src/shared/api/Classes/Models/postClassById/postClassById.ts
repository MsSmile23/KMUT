import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IClass } from '../../../../types/classes'
import { API_CLASSES_SCHEME } from '../../../Classes/settings'

export const postClassById = async (
    id: string,
    payload: IClass
): Promise<IApiReturn<IClass | undefined>> => {
    const url = API_CLASSES_SCHEME.postClassById.url.replace(':id', id)

    const response = await API.apiQuery<IClass>({
        method: API_CLASSES_SCHEME.postClassById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
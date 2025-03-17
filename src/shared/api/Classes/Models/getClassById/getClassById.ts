import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IClass } from '../../../../types/classes'
import { API_CLASSES_SCHEME } from '../../../Classes/settings'

export const getClassById = async ({
    id
}: {id: string}): Promise<IApiReturn<IClass | undefined>> => {
    const url = API_CLASSES_SCHEME.getClassById.url.replace(':id', id)
    
    const response = await API.apiQuery<IClass>({
        method: API_CLASSES_SCHEME.getClassById.method,
        url: url,
    })

    return {
        ...response,
    }
}
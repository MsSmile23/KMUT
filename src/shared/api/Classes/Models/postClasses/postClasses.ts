import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IClass } from '../../../../types/classes'
import { API_CLASSES_SCHEME } from '../../../Classes/settings'

export const postClasses = async (
    payload: IClass,
    id?: IClass['id']
): Promise<IApiReturn<IClass[] | undefined>> => {
    const url =
    API_CLASSES_SCHEME.postClasses.url +
    (id !== undefined ? `/${id}` : ' ');
    const response = await API.apiQuery<IClass[]>({
        method: id == undefined ? API_CLASSES_SCHEME.postClasses.method :  API_CLASSES_SCHEME.postClassById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
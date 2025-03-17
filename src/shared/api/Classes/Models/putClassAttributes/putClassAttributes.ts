import { IClassAttributes } from '@shared/types/class-attributes'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_CLASSES_SCHEME } from '../../../Classes/settings'

export const putClassAttributes = async (
    payload: IClassAttributes[]
): Promise<IApiReturn<any | undefined>> => {
    const query = {
        method: API_CLASSES_SCHEME.putClassAttributes.method,
        url: API_CLASSES_SCHEME.putClassAttributes.url,
        data: { data: { ...payload } },
    }

    const response = await API.apiQuery<any[]>(query)

    return {
        ...response,
    }
}
import { API, IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_CLASS_ATTRIBUTES_SCHEME } from '../../settings'
import {  IClassesAttributes } from '@shared/types/class-attributes'

export const getClassAttributes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IClassesAttributes[]>> => {
    const response = await API.apiGetAsArray<IClassesAttributes[]>({
        endpoint: { ...API_CLASS_ATTRIBUTES_SCHEME.getClassAttributes },
        payload,
    })

    return { ...response }
}
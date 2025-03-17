import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_OPERATIONS_SCHEME } from '../../settings'

export const getOperations = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<any[]>> => {
    const response = await API.apiGetAsArray<any[]>({
        endpoint: { ...API_OPERATIONS_SCHEME.getOperations },
        payload,
    })

    return { ...response }
}
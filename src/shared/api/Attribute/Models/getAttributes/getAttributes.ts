import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IAttribute } from '../../../../types/attributes'
import { API_ATTRIBUTE_SCHEME } from '../../../Attribute/settings'

export const getAttributes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IAttribute[]>> => {
    const response = await API.apiGetAsArray<IAttribute[]>({
        endpoint: { ...API_ATTRIBUTE_SCHEME.getAttributes },
        payload,
    })

    return { ...response }
}
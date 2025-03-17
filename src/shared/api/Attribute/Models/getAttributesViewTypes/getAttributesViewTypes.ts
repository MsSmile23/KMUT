import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IAttributeViewType } from '../../../../types/attributes'
import { API_ATTRIBUTE_SCHEME } from '../../settings'

export const getAttributesViewTypes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IAttributeViewType[]>> => {
    const response = await API.apiGetAsArray<IAttributeViewType[]>({
        endpoint: { ...API_ATTRIBUTE_SCHEME.getAttributesViewTypes },
        payload,
    })

    return { ...response }
}
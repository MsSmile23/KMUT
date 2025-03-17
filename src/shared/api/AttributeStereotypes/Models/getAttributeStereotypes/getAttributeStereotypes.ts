import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IAttributeStereotype } from '../../../../types/attribute-stereotypes'
import { API_ATTRIBUTE_STEREOTYPES_SCHEME } from '../../settings'


export const getAttributeStereotypes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IAttributeStereotype[]>> => {
    const response = await API.apiGetAsArray<IAttributeStereotype[]>({
        endpoint: { ...API_ATTRIBUTE_STEREOTYPES_SCHEME.getAttributeStereotypes },
        payload,
    })

    return { ...response }
}
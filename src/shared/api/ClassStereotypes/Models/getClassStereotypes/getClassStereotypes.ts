import { API, IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IClassStereotype } from '@shared/types/classes-stereotypes'
import { API_CLASS_STEREOTYPE_SCHEME } from '../../settings'

export const getClassStereotypes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IClassStereotype[]>> => {
    const response = await API.apiGetAsArray<IClassStereotype[]>({
        endpoint: { ...API_CLASS_STEREOTYPE_SCHEME.getClassStereotypes },
        payload,
    })

    return { ...response }
}
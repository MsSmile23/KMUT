import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IClass } from '../../../../types/classes'
import { API_CLASSES_SCHEME } from '../../../Classes/settings'

export const getClasses = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IClass[]>> => {
    const response = await API.apiGetAsArray<IClass[]>({
        endpoint: { ...API_CLASSES_SCHEME.getClasses },
        payload,
    })

    return { ...response }
}
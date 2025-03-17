import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'

import { API_OBJECTS_SCHEME } from '../../../Objects/settings'
import { IObject } from '@shared/types/objects';

export const getObjects = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IObject[]>> => {
    const response = await API.apiGetAsArray<IObject[]>({
        endpoint: { ...API_OBJECTS_SCHEME.getObjects },
        payload,
    })

    return { ...response }
}
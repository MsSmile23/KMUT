import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'

import { API_OBJECTS_SCHEME } from '../../settings'
import { IObject } from '@shared/types/objects';

export const searchObjects = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IObject[]>> => {
    const response = await API.apiGetAsArray<IObject[]>({
        endpoint: { ...API_OBJECTS_SCHEME.searchObjects },
        payload,
    })

    return { ...response }
}
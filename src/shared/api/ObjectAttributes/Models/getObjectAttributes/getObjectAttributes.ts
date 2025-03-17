import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_OBJECT_ATTRIBUTES_SCHEME } from '../../settings'
import { IObjectAttribute } from '@shared/types/objects';

export const getObjectAttributes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IObjectAttribute[]>> => {
    const response = await API.apiGetAsArray<IObjectAttribute[]>({
        endpoint: { ...API_OBJECT_ATTRIBUTES_SCHEME.getObjectAttributes },
        payload,
    })

    return { ...response }
}
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_NETFLOW_SCHEME } from '../../settings'
import { IObjectAttribute } from '@shared/types/objects';

export const getNetflowSources = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IObjectAttribute[]>> => {
    const response = await API.apiGetAsArray<IObjectAttribute[]>({
        endpoint: { ...API_NETFLOW_SCHEME.getNetflowSources },
        payload,
    })

    return { ...response }
}
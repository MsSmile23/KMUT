
import { API_LOGIN } from '@shared/api/System/settings';
import { API, IApiGetPayload, IApiReturnObject } from '@shared/lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const'
import { ISystem } from '@shared/types/system';

export const getSystem = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<IApiReturnObject<ISystem>> => {
    const endpoint = { ...API_LOGIN.getSystem };
    // const response:any= axios.post(endpoint.url, payload)
    const response = await API.apiQuery<ISystem>(
        {
            method: endpoint.method,
            url: endpoint.url,
            data: payload
        }
    );

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    };
};
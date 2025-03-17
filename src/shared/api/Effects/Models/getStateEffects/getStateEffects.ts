import { PAYLOAD_DEFAULT_GET } from '@shared/api/const';
import { API, IApiGetPayload, IApiReturnObject } from '@shared/lib/ApiSPA';
import { IEffects } from '@shared/types/effects';
import { API_EFFECTS_SCHEME } from '../../settings';

export const getStateEffects = async (
    stateId: string,
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturnObject<IEffects[]>> => {
    const endpoint = { ...API_EFFECTS_SCHEME.getStateEffects };
    const url = endpoint.url.replace(':stateId', stateId)
    const response = await API.apiQuery<IEffects[]>(
        {
            method: endpoint.method,
            url: url,
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

import { API_STATES_ENTITIES } from '@shared/api/State-entities/settings';
import { API, IApiGetPayload, IApiReturnObject } from '@shared/lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const'
import { IStateEntities } from '@shared/types/state-entities';


export const getStateEntities = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturnObject<IStateEntities>> => {
    const endpoint = { ...API_STATES_ENTITIES.getStateEntities };
    const response = await API.apiQuery<IStateEntities>(
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
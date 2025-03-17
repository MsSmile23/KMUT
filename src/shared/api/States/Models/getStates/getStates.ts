
import { API, IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const'
import { IState } from '@shared/types/states'
import { API_STATES_SCHEME } from '../../settings';

export const getStates = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IState[]>> => {
    const endpoint = { ...API_STATES_SCHEME.getStates };

    const response = await API.apiGetAsArray<IState[]>({
        endpoint: endpoint,
        payload,
    })

    return { ...response }
};
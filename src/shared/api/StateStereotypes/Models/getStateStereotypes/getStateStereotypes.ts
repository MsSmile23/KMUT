import { API, IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const'
import { API_STATE_STEREOTYPES_SCHEME } from '../../settings';
import { IStateStereotype } from '@shared/types/state-stereotypes';

export const getStateStereotypes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IStateStereotype[]>> => {
    const endpoint = { ...API_STATE_STEREOTYPES_SCHEME.getStateStereoTypes };

    const response = await API.apiGetAsArray<IStateStereotype[]>({
        endpoint: endpoint,
        payload,
    })

    return { ...response }
};
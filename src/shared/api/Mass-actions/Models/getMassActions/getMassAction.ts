import { IMassActions } from '@shared/types/mass-actions'
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { API_MASS_ACTIONS_SCHEME } from '../../settings'
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const'


export const getMassAction = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IMassActions[] | undefined>> => { 

    const response = await API.apiGetAsArray<IMassActions[]>(
        {
            endpoint: { ...API_MASS_ACTIONS_SCHEME.getMassActions },
            payload,
        }
    )

    return {
        ...response,
    }
}
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_STATE_MACHINES_SCHEME } from '../../settings'
import { IStateMachine } from '@shared/types/state-machines'

export const getStateMachines = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IStateMachine[]>> => {
    const response = await API.apiGetAsArray<IStateMachine[]>({
        endpoint: { ...API_STATE_MACHINES_SCHEME.getStateMachines },
        payload,
    })

    return { ...response }
}
import { IStateSection } from '@shared/types/state-section'
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_STATE_SECTIONS_SCHEME } from '../../settings'

export const getStateSections = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IStateSection[]>> => {
    const response = await API.apiGetAsArray<IStateSection[]>({
        endpoint: { ...API_STATE_SECTIONS_SCHEME.getStatesSections },
        payload,
    })

    return { ...response }
}
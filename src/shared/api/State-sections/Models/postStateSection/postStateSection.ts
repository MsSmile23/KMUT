import { IStateSection } from '@shared/types/state-section'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_SECTIONS_SCHEME } from '../../settings'



export const postStateSection = async (payload: object):
    Promise<IApiReturn<Partial<IStateSection> | undefined>> => {
    const response = await API.apiQuery<Partial<IStateSection> | undefined>({
        method: API_STATE_SECTIONS_SCHEME.postStateSection.method,
        url: API_STATE_SECTIONS_SCHEME.postStateSection.url,
        data: payload,
    })

    return {
        ...response,
    }
}
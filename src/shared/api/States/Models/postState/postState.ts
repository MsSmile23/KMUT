import { IState } from '@shared/types/states'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATES_SCHEME } from '../../settings'




export const postState = async (payload: IState): Promise<IApiReturn<IState | undefined>> => {

    const response = await API.apiQuery<IState>({
        method: API_STATES_SCHEME.postState.method,
        url: API_STATES_SCHEME.postState.url,
        data: payload,
    })

    return {
        ...response,
    }
}
import { IState } from '@shared/types/states'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATES_SCHEME } from '../../settings'



export const patchStateById = async (
    id: string,
    payload: IState
): Promise<IApiReturn<IState | undefined>> => {
    const url = API_STATES_SCHEME.patchStateById.url.replace(':id', id)

    const response = await API.apiQuery<IState>({
        method: API_STATES_SCHEME.patchStateById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
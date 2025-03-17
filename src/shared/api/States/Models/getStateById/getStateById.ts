
import { IState } from '@shared/types/states'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATES_SCHEME } from '../../settings'


export const getStateById = async (id: string | number): Promise<IApiReturn<IState | undefined>> => {
    const url = API_STATES_SCHEME.getStateById.url.replace(':id', String(id))
    const response = await API.apiQuery<IState>({
        method: API_STATES_SCHEME.getStateById.method,
        url: url,
    })

    return {
        ...response,
    }
}
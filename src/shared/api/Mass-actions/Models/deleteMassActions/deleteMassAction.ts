import { IMassActions } from '@shared/types/mass-actions'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_MASS_ACTIONS_SCHEME } from '../../settings'


export const deleteMassAction = async (
    id: number
): Promise<IApiReturn<IMassActions | undefined>> => { 
   
    const response = await API.apiQuery<IMassActions>(
        { 
            method: API_MASS_ACTIONS_SCHEME.deleteMassAction.method,
            url: API_MASS_ACTIONS_SCHEME.deleteMassAction.url.replace(':id', id),
        }
    )

    return {
        ...response,
    }
}
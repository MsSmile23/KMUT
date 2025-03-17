import { IMassActions } from '@shared/types/mass-actions'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_MASS_ACTIONS_SCHEME } from '../../settings'


export const postMassAction = async (
    payload: IMassActions
): Promise<IApiReturn<IMassActions | undefined>> => { 
    
    const response = await API.apiQuery<IMassActions>(
        { 
            method: API_MASS_ACTIONS_SCHEME.postMassAction.method,
            url: API_MASS_ACTIONS_SCHEME.postMassAction.url,
            data: payload
        }
    )

    return {
        ...response,
    };
}
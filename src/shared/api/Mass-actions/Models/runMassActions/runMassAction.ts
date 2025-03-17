import { IMassActions, IMassActionsPost } from '@shared/types/mass-actions'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_MASS_ACTIONS_SCHEME } from '../../settings'

export const runMassAction = async (
    id: number,
    data?: IMassActionsPost
): Promise<IApiReturn<IMassActions | undefined>> => { 
    
    const response = await API.apiQuery<IMassActions>(
        { 
            method: API_MASS_ACTIONS_SCHEME.runMassAction.method,
            url: API_MASS_ACTIONS_SCHEME.runMassAction.url.replace(':id', `${id}`),
            data: data
        }
    )

    return {
        ...response,
    }
}
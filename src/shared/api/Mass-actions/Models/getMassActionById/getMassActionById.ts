import { IMassActions } from '@shared/types/mass-actions'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_MASS_ACTIONS_SCHEME } from '../../settings'


export const getMassActionById = async ({
    id
}: {id: string}): Promise<IApiReturn<IMassActions | undefined>> => {     

    const response = await API.apiQuery<IMassActions>(
        { 
            method: API_MASS_ACTIONS_SCHEME.getMassActionById.method,
            url: API_MASS_ACTIONS_SCHEME.getMassActionById.url.replace(':id', id),
        }
    )

    return {
        ...response,
    }
}
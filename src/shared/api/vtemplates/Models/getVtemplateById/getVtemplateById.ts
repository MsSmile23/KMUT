
import { API } from '../../../../lib/ApiSPA'

import { API_VTEMPLATES_SCHEME } from '../../settings'

export const getVtemplateById = async (
    id: string
): Promise<any> => {
    const url = API_VTEMPLATES_SCHEME.getVtemplatesById.url.replace(':id', id)
    
    const response = await API.apiQuery<any>({
        method: API_VTEMPLATES_SCHEME.getVtemplatesById.method,
        url: url,
    })

    return {
        ...response,
    }
}
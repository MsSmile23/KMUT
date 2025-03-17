import { API } from '../../../../lib/ApiSPA'

import { IAttribute } from '../../../../types/attributes'
import { API_VTEMPLATES_SCHEME } from '../../settings'

export const deleteVtemplatesById = async (
    id: string
): Promise<any> => {
    const url = API_VTEMPLATES_SCHEME.deleteVtemplatesById.url.replace(':id', id)

    const response = await API.apiQuery<IAttribute>({
        method: API_VTEMPLATES_SCHEME.deleteVtemplatesById.method,
        url: url,
    })

    return {
        ...response,
    }
}
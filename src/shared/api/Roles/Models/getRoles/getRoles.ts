import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_ROLES_SCHEME } from '../../settings'
import { IRole } from '@shared/types/roles'

export const getRoles = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IRole[]>> => {
    const endpoint =  { ...API_ROLES_SCHEME.getRoles }
    const response = await API.apiGetAsArray<IRole[]>({
        endpoint: endpoint,
        payload,
    })

    return { ...response }

}
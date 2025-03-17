import { IRole, IRolePostPayload } from '@shared/types/roles'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_ROLES_SCHEME } from '../../settings'

export const postRole = async (payload: IRolePostPayload):
    Promise<IApiReturn<Partial<IRole> | undefined>> => {
    const response = await API.apiQuery<Partial<IRole> | undefined>({
        method: API_ROLES_SCHEME.postRole.method,
        url: API_ROLES_SCHEME.postRole.url,
        data: payload,
    })

    return {
        ...response,
    }
}
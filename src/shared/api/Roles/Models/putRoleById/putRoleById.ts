import { IRolePostPayload, IRole } from '@shared/types/roles'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_ROLES_SCHEME } from '../../settings'

export const putRoleById = async (
    id: string,
    payload: IRolePostPayload
): Promise<IApiReturn<IRole | undefined>> => {
    const url = API_ROLES_SCHEME.putRoleById.url.replace(':id', id)
    const response = await API.apiQuery<IRole>({
        method: API_ROLES_SCHEME.putRoleById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
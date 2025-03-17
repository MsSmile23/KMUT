import { IRole } from '@shared/types/roles'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_ROLES_SCHEME } from '../../settings'


export const getRoleById = async (id: number): Promise<IApiReturn<IRole | undefined>> => {
    const url = API_ROLES_SCHEME.getRoleById.url.replace(':id', `${id}`)

    return API.apiQuery<IRole>({
        method: API_ROLES_SCHEME.getRoleById.method,
        url: url
    })
}
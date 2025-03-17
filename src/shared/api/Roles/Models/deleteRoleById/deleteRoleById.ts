import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_ROLES_SCHEME } from '../../settings'


export const deleteRoleById = async (id: number): Promise<IApiReturn<any | undefined>> => {
    const url = API_ROLES_SCHEME.deleteRoleById.url.replace(':id', `${id}`)

    return API.apiQuery<any>({
        method: API_ROLES_SCHEME.deleteRoleById.method,
        url: url
    })
}
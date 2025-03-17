import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_GROUP_POLICES_SCHEME } from '../../setting'

export const deleteGroupPolicyById = async (id: number): Promise<IApiReturn<any | undefined>> => {
    const url = API_GROUP_POLICES_SCHEME.deleteGroupPolicyById.url.replace(':id', `${id}`)

    return API.apiQuery<any>({
        method: API_GROUP_POLICES_SCHEME.deleteGroupPolicyById.method,
        url: url
    })
}
import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_GROUP_POLICES_SCHEME } from '../../setting'
import { IGroupPolicy } from '@shared/types/group-policies'

export const patchGroupPolicyById = async (
    id: number,
    payload: IGroupPolicy
): Promise<IApiReturn<IGroupPolicy | undefined>> => {
    const url = API_GROUP_POLICES_SCHEME.patchGroupPolicyById.url.replace(':id', `${id}`)
    const response = await API.apiQuery<IGroupPolicy>({
        method: API_GROUP_POLICES_SCHEME.patchGroupPolicyById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
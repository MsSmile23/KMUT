import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_GROUP_POLICES_SCHEME } from '../../setting'
import { IGroupPolicy } from '@shared/types/group-policies'

export const postGroupPolicy = async (
    payload: IGroupPolicy
): Promise<IApiReturn<IGroupPolicy | undefined>> => {
    const response = await API.apiQuery<IGroupPolicy>({
        method: API_GROUP_POLICES_SCHEME.postGroupPolicy.method,
        url: API_GROUP_POLICES_SCHEME.postGroupPolicy.url,
        data: payload
    })

    return {
        ...response
    }
}
import { API, IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'
import { API_GROUP_POLICES_SCHEME } from '../../setting'
import { IGroupPolicy } from '@shared/types/group-policies'

export const getGroupPolicies = async (
    payload: IApiGetPayload
): Promise<IApiReturn<IGroupPolicy[]>> => {
    const endpoints = { ...API_GROUP_POLICES_SCHEME.getGroupPolicies }
    const response = await API.apiGetAsArray<IGroupPolicy[]>({
        endpoint: endpoints,
        payload,
    })

    return {
        ...response
    }
}
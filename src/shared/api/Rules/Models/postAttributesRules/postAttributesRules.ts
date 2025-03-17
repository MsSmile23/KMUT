import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_RULES_SCHEME } from '../../settings'

export const postAttributesRules = async (
    payload: any[]
): Promise<IApiReturn<any[] | undefined>> => {
    const response = await API.apiQuery<any[]>({
        method: API_RULES_SCHEME.postAttributesRules.method,
        url: API_RULES_SCHEME.postAttributesRules.url,
        data: payload,
    })

    return {
        ...response,
    }
}
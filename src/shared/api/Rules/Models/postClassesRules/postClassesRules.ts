import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_RULES_SCHEME } from '../../settings'

export const postClassesRules = async (
    payload: any[]
): Promise<IApiReturn<any[] | undefined>> => {
    const response = await API.apiQuery<any[]>({
        method: API_RULES_SCHEME.postClassesRules.method,
        url: API_RULES_SCHEME.postClassesRules.url,
        data: payload,
    })

    return {
        ...response,
    }
}
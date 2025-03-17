import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_RULES_SCHEME } from '../../settings'
import { IObject } from '@shared/types/objects';

export const getRulesByStateId = async (id: string | number): Promise<IApiReturn<any | undefined>> => {
    const url = API_RULES_SCHEME.getRulesByStateId.url.replace(':id', String(id))
    const response = await API.apiQuery<any>({
        method: API_RULES_SCHEME.getRulesByStateId.method,
        url: url,
    })

    return {
        ...response,
    }
}
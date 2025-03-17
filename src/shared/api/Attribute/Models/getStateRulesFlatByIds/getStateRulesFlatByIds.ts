import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { TAttributeStateRulesFlat } from '@shared/types/attributes'
import { API_ATTRIBUTE_SCHEME } from '../../settings'

export const getStateRulesFlatByIds = async (
    ids: string
): Promise<IApiReturn<TAttributeStateRulesFlat[] | undefined>> => {
    const url = `${API_ATTRIBUTE_SCHEME.getStateRulesFlatByIds.url}${ids}`
    
    const response = await API.apiQuery<TAttributeStateRulesFlat[]>({
        method: API_ATTRIBUTE_SCHEME.getStateRulesFlatByIds.method,
        url: url,
    })

    return {
        ...response,
    }
}
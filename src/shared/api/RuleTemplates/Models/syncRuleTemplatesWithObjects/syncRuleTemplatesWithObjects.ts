import { ISyncRuleTemplates } from '@shared/types/rule-templates'
import { API_RULE_TEMPLATES_SCHEME } from '../../settings'
import { API, IApiReturn } from '@shared/lib/ApiSPA'

export const syncRuleTemplatesWithObjects = async (
    payload: ISyncRuleTemplates
): Promise<IApiReturn<any | undefined>> => {
    const response = await API.apiQuery<any>({
        method: API_RULE_TEMPLATES_SCHEME.syncRuleTemplates.method,
        url: API_RULE_TEMPLATES_SCHEME.syncRuleTemplates.url,
        data: payload,
    })  
    
    return {
        ...response,
    }

}
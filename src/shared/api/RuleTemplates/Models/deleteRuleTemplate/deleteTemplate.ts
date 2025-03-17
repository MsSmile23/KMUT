import { IRuleTemplate } from '@shared/types/rule-templates'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import {  API_RULE_TEMPLATES_SCHEME } from '../../settings'

export const deleteRuleTemplate = async (
    id: string
): Promise<IApiReturn<IRuleTemplate | undefined>> => {
    const url = API_RULE_TEMPLATES_SCHEME.deleteRuleTemplate.url.replace(':id', id)
    
    const response = await API.apiQuery<IRuleTemplate>({
        method: API_RULE_TEMPLATES_SCHEME.deleteRuleTemplate.method,
        url: url,
    })

    return {
        ...response,
    }
}
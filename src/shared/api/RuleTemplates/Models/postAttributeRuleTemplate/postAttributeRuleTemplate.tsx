import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { IAttributeRuleTemplatePost, IRuleTemplate } from '@shared/types/rule-templates'
import { API_RULE_TEMPLATES_SCHEME } from '../../settings'


export const postAttributeRuleTemplate = async (
    payload: IAttributeRuleTemplatePost
): Promise<IApiReturn<IRuleTemplate | undefined>> => {
    const response = await API.apiQuery<IRuleTemplate>({
        method: API_RULE_TEMPLATES_SCHEME.createAttributesRuleTemplate.method,
        url: API_RULE_TEMPLATES_SCHEME.createAttributesRuleTemplate.url,
        data: payload,
    })  

    return {
        ...response,
    }
}
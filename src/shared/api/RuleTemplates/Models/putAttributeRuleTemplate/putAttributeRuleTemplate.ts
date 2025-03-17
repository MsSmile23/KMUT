import { IAttributeRuleTemplatePost, IRuleTemplate } from '@shared/types/rule-templates'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_RULE_TEMPLATES_SCHEME } from '../../settings'

export const putAttributeRuleTemplate = async (
    id: string,
    payload: IAttributeRuleTemplatePost
): Promise<IApiReturn<IRuleTemplate | undefined>> => {
    const url = API_RULE_TEMPLATES_SCHEME.putAttributesRuleTemplate.url.replace(':id', id)

    const response = await API.apiQuery<IRuleTemplate>({
        method: API_RULE_TEMPLATES_SCHEME.putAttributesRuleTemplate.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
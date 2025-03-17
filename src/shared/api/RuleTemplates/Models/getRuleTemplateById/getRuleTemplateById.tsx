import { IRuleTemplateGet } from '@shared/types/rule-templates'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_RULE_TEMPLATES_SCHEME } from '../../settings'

export const getRuleTemplateById = async (
    id: string
): Promise<IApiReturn<IRuleTemplateGet | undefined>> => {
    const url = API_RULE_TEMPLATES_SCHEME.getRuleTemplateById.url.replace(':id', id)
    
    const response = await API.apiQuery<IRuleTemplateGet>({
        method: API_RULE_TEMPLATES_SCHEME.getRuleTemplateById.method,
        url: url,
    })

    return {
        ...response,
    }
}
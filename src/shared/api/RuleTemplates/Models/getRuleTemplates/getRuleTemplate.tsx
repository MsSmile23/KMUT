import { IRuleTemplate } from '@shared/types/rule-templates'
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_RULE_TEMPLATES_SCHEME } from '../../settings'

export const getRuleTemplates = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IRuleTemplate[]>> => {
    const response = await API.apiGetAsArray<IRuleTemplate[]>({
        endpoint: { ...API_RULE_TEMPLATES_SCHEME.getRuleTemplates },
        payload,
    })
    
    return { ...response }
}
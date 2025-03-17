import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_RULES_ENDPOINTS = ['postAttributesRules', 'postClassesRules', 'getRulesByStateId'] as const

type IEndpoint = (typeof API_RULES_ENDPOINTS)[number]

export const API_RULES_SCHEME: IApiEntityScheme<IEndpoint> = {
    postAttributesRules: {
        method: 'POST',
        url: ENTITY.RULES.API_ROUTE + '/groups/attributes',
    },
    postClassesRules: {
        method: 'POST',
        url: ENTITY.RULES.API_ROUTE + '/groups/classes'
    },
    getRulesByStateId: {
        method: 'GET',
        url: 'states' + '/:id/' +  ENTITY.RULES.API_ROUTE 
    }
}
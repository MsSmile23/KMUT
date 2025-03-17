import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_RULE_TEMPLATES_ENDPOINTS = [
    'getRuleTemplates', 
    'getRuleTemplateById', 
    'createClassesRuleTemplate',
    'createAttributesRuleTemplate',
    'syncRuleTemplates',
    'deleteRuleTemplate',
    'putAttributesRuleTemplate',
] as const

type IEndpoint = (typeof API_RULE_TEMPLATES_ENDPOINTS)[number]

export const API_RULE_TEMPLATES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getRuleTemplates: {
        method: 'GET',
        url: ENTITY.RULES.API_ROUTE + '/templates',
    },
    getRuleTemplateById: {
        method: 'GET',
        url: ENTITY.RULES.API_ROUTE + '/templates/' + ':id',
    },
    createClassesRuleTemplate: {
        method: 'POST',
        url: ENTITY.RULES.API_ROUTE + '/templates/' + 'classes'
    },
    createAttributesRuleTemplate: {
        method: 'POST',
        url: ENTITY.RULES.API_ROUTE + '/templates/' + 'attributes'
    },
    syncRuleTemplates: {
        method: 'POST',
        url: ENTITY.RULES.API_ROUTE +  '/templates/' + 'sync-entities'
    },
    deleteRuleTemplate: {
        method: 'DELETE',
        url: ENTITY.RULES.API_ROUTE + '/templates/' + ':id',
    },
    putAttributesRuleTemplate: {
        method: 'PUT',
        url: ENTITY.RULES.API_ROUTE + '/templates/' + 'attributes/' + ':id',
    }

}
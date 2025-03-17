import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_ATTRIBUTE_ENDPOINTS = [
    'getAttributes',
    'getAttributesViewTypes',
    'getAttributeById',
    'postAttributes',
    'patchAttributeById',
    'deleteAttributeById',
    'updateAttributesLinks',
    'getStateRulesFlatByIds'
] as const

type IEndpoint = (typeof API_ATTRIBUTE_ENDPOINTS)[number]

export const API_ATTRIBUTE_SCHEME: IApiEntityScheme<IEndpoint> = {
    getAttributes: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE.API_ROUTE,
    },
    getAttributeById: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE.API_ROUTE + '/:id',
    },
    getAttributesViewTypes: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE.API_ROUTE + '/view-types',
    },
    postAttributes: {
        method: 'POST',
        url: ENTITY.ATTRIBUTE.API_ROUTE,
    },
    patchAttributeById: {
        method: 'PATCH',
        url: ENTITY.ATTRIBUTE.API_ROUTE + '/:id',
    },
    deleteAttributeById: {
        method: 'DELETE',
        url: ENTITY.ATTRIBUTE.API_ROUTE + '/:id',
    },
    updateAttributesLinks: {
        method: 'POST',
        url: ENTITY.ATTRIBUTE.API_ROUTE + '/links-update'
    },
    getStateRulesFlatByIds: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE.API_ROUTE + '/state-rules-flat?attribute_ids[]='
    }
}
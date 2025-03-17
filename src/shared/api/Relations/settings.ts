import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_RELATION_ENDPOINTS = [
    'getRelations',
    'getRelationById',
    'postRelation',
    'patchRelationById',
    'deleteRelationById',
] as const

type IEndpoint = (typeof API_RELATION_ENDPOINTS)[number]

export const API_RELATIONS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getRelations: {
        method: 'GET',
        url: ENTITY.RELATION.API_ROUTE,
    },
    getRelationById: {
        method: 'GET',
        url: ENTITY.RELATION.API_ROUTE + '/:id',
    },
    postRelation: {
        method: 'POST',
        url: ENTITY.RELATION.API_ROUTE,
    },
    patchRelationById: {
        method: 'PATCH',
        url: ENTITY.RELATION.API_ROUTE + '/:id',
    },
    deleteRelationById: {
        method: 'DELETE',
        url: ENTITY.RELATION.API_ROUTE + '/:id',
    },
}
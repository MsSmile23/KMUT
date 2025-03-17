import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_RELATION_STEREOTYPES_ENDPOINTS = [
    'getRelationStereotypes',
    'getRelationStereotypesById',
] as const

type IEndpoint = (typeof API_RELATION_STEREOTYPES_ENDPOINTS)[number]

export const API_RELATION_STEREOTYPES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getRelationStereotypes: {
        method: 'GET',
        url: ENTITY.RELATION_STEREOTYPE.API_ROUTE,
    },
    getRelationStereotypesById: {
        method: 'GET',
        url: ENTITY.RELATION_STEREOTYPE.API_ROUTE + '/:id',
    },
}
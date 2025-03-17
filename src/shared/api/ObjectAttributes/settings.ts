import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_OBJECT_ATTRIBUTES_ENDPOINTS = [
    'getObjectAttributes',
    'getObjectAttributeById',
] as const

type IEndpoint = (typeof API_OBJECT_ATTRIBUTES_ENDPOINTS)[number]

export const API_OBJECT_ATTRIBUTES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getObjectAttributes: {
        method: 'GET',
        url: ENTITY.OBJECT_ATTRIBUTE.API_ROUTE,
    },
    getObjectAttributeById: {
        method: 'GET',
        url: ENTITY.OBJECT_ATTRIBUTE.API_ROUTE + '/:id',
    },
}
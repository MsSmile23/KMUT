import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_CLASSES_ENDPOINTS = [
    'getClasses',
    'getClassById',
    'postClasses',
    'postClassById',
    'putClassAttributes',
    'putClassOperations',
    'deleteClassById'
] as const

type IEndpoint = (typeof API_CLASSES_ENDPOINTS)[number]

export const API_CLASSES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getClasses: {
        method: 'GET',
        url: ENTITY.CLASS.API_ROUTE,
    },
    getClassById: {
        method: 'GET',
        url: ENTITY.CLASS.API_ROUTE + '/:id',
    },
    postClasses: {
        method: 'POST',
        url: ENTITY.CLASS.API_ROUTE,
    },
    postClassById: {
        method: 'PATCH',
        url: ENTITY.CLASS.API_ROUTE + '/:id',
    },
    putClassAttributes: {
        method: 'PUT',
        url: 'class-attributes'
    },
    putClassOperations: {
        method: 'PUT',
        url: 'operations/link-classes'
    },
    deleteClassById: {
        method: 'DELETE',
        url: ENTITY.CLASS.API_ROUTE + '/:id',
    }
}
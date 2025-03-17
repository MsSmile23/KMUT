import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_CLASS_ATTRIBUTES_ENDPOINTS = [
    'getClassAttributes',
    'patchClassAttributes',
    'putClassAttributes'
] as const

type IEndpoint = (typeof API_CLASS_ATTRIBUTES_ENDPOINTS)[number]

export const API_CLASS_ATTRIBUTES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getClassAttributes: {
        method: 'GET',
        url: ENTITY.CLASS_ATTRIBUTES.API_ROUTE,
    },
    patchClassAttributes: {
        method: 'PATCH',
        url: ENTITY.CLASS_ATTRIBUTES.API_ROUTE,
    },
    putClassAttributes: {
        method: 'PUT',
        url: ENTITY.CLASS_ATTRIBUTES.API_ROUTE,
    },
}
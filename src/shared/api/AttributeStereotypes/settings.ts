import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_ATTRIBUTE_STEREOTYPES_ENDPOINTS = [
    'getAttributeStereotypes',
    'getAttributeStereotypesById',
] as const

type IEndpoint = (typeof API_ATTRIBUTE_STEREOTYPES_ENDPOINTS)[number]

export const API_ATTRIBUTE_STEREOTYPES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getAttributeStereotypes: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE_STEREOTYPE.API_ROUTE,
    },
    getAttributeStereotypesById: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE_STEREOTYPE.API_ROUTE + '/:id',
    },
}
import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_CLASS_STEREOTYPES_ENDPOINTS = [
    'getClassStereotypes',
    'getClassStereotypeById',
] as const

type IEndpoint = (typeof API_CLASS_STEREOTYPES_ENDPOINTS)[number]

export const API_CLASS_STEREOTYPE_SCHEME: IApiEntityScheme<IEndpoint> = {
    getClassStereotypes: {
        method: 'GET',
        url: ENTITY.CLASS_STEREOTYPE.API_ROUTE,
    },
    getClassStereotypeById: {
        method: 'GET',
        url: ENTITY.CLASS_STEREOTYPE.API_ROUTE + '/:id',
    },
}
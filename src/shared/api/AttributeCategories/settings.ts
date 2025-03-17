import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_ATTRIBUTE_CATEGORIES_ENDPOINTS = [
    'getAttributeCategories',
    'getAttributeCategoryById',
    'postAttributeCategories',
    'patchAttributeCategoryById',
    'deleteAttributeCategoryById',
] as const

type IEndpoint = (typeof API_ATTRIBUTE_CATEGORIES_ENDPOINTS)[number]

export const API_ATTRIBUTE_CATEGORIES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getAttributeCategories: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE_CATEGORY.API_ROUTE,
    },
    getAttributeCategoryById: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE_CATEGORY.API_ROUTE + '/:id',
    },
    postAttributeCategories: {
        method: 'POST',
        url: ENTITY.ATTRIBUTE_CATEGORY.API_ROUTE,
    },
    patchAttributeCategoryById: {
        method: 'PATCH',
        url: ENTITY.ATTRIBUTE_CATEGORY.API_ROUTE + '/:id',
    },
    deleteAttributeCategoryById: {
        method: 'DELETE',
        url: ENTITY.ATTRIBUTE_CATEGORY.API_ROUTE + '/:id',
    },
}
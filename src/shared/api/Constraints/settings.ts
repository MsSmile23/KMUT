import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_CONSTRAINTS_ENDPOINTS = [
    'getConstraints',
    'postConstraint',
    'getConstraintById',
    'patchConstraint',
    'deleteConstraint',
] as const

type IEndpoint = (typeof API_CONSTRAINTS_ENDPOINTS)[number]

export const API_CONSTRAINTS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getConstraints: {
        method: 'GET',
        url: ENTITY.CONSTRAINTS.API_ROUTE,
    },
    postConstraint: {
        method: 'POST',
        url: ENTITY.CONSTRAINTS.API_ROUTE,
    },
    getConstraintById: {
        method: 'GET',
        url: ENTITY.CONSTRAINTS.API_ROUTE + '/:id',
    },
    patchConstraint: {
        method: 'PATCH',
        url: ENTITY.CONSTRAINTS.API_ROUTE + '/:id',
    },
    deleteConstraint: {
        method: 'DELETE',
        url: ENTITY.CONSTRAINTS.API_ROUTE + '/:id',
    },
}
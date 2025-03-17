import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_ROLES_ENDPOINTS = ['getRoles', 'postRole', 'putRoleById', 'deleteRoleById', 'getRoleById'] as const

type IEndpoint = (typeof API_ROLES_ENDPOINTS)[number]

export const API_ROLES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getRoles: {
        method: 'GET',
        url: ENTITY.ROLES.API_ROUTE,
    },
    postRole: {
        method: 'POST',
        url: ENTITY.ROLES.API_ROUTE,
    },
    putRoleById: {
        method: 'PUT',
        url: ENTITY.ROLES.API_ROUTE + '/:id',
    },
    deleteRoleById: {
        method: 'DELETE',
        url: ENTITY.ROLES.API_ROUTE + '/:id',
    },
    getRoleById: {
        method: 'GET',
        url: ENTITY.ROLES.API_ROUTE + '/:id',
    },
}
import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_STATES_ENDPOINTS = [
    'getStates',
    'getStateById',
    'postState',
    'patchStateById',
    'putStateById',
    'deleteStateById',
] as const


type IEndpoint = (typeof API_STATES_ENDPOINTS)[number]

export const API_STATES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getStates: {
        method: 'GET',
        url: ENTITY.STATES.API_ROUTE,
    },
    getStateById: {
        method: 'GET',
        url: ENTITY.STATES.API_ROUTE + '/:id',
    },
    postState: {
        method: 'POST',
        url: ENTITY.STATES.API_ROUTE,
    },
    patchStateById: {
        method: 'PATCH',
        url: ENTITY.STATES.API_ROUTE + '/:id',
    },
    putStateById: {
        method: 'PUT',
        url: ENTITY.STATES.API_ROUTE + '/:id',
    },
    deleteStateById: {
        method: 'DELETE',
        url: ENTITY.STATES.API_ROUTE + '/:id',
    },
}
import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_STATE_MACHINES_ENDPOINTS = [
    'getStateMachines',
    'getStateMachineById',
    'postStateMachines',
    'patchStateMachineById',
    'putStateMachineById',
    'deleteStateMachineById',
    'postStateMachineTransitions'
] as const

type IEndpoint = (typeof API_STATE_MACHINES_ENDPOINTS)[number]

export const API_STATE_MACHINES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getStateMachines: {
        method: 'GET',
        url: ENTITY.STATE_MACHINES.API_ROUTE,
    },
    getStateMachineById: {
        method: 'GET',
        url: ENTITY.STATE_MACHINES.API_ROUTE + '/:id',
    },
    postStateMachines: {
        method: 'POST',
        url: ENTITY.STATE_MACHINES.API_ROUTE,
    },
    patchStateMachineById: {
        method: 'PATCH',
        url: ENTITY.STATE_MACHINES.API_ROUTE + '/:id',
    },
    putStateMachineById: {
        method: 'PUT',
        url: ENTITY.STATE_MACHINES.API_ROUTE + '/:id',
    },
    deleteStateMachineById: {
        method: 'DELETE',
        url: ENTITY.STATE_MACHINES.API_ROUTE + '/:id',
    },
    postStateMachineTransitions: {
        method: 'POST',
        url: ENTITY.STATE_MACHINES.API_ROUTE + '/:id' + '/transitions',
    }
}
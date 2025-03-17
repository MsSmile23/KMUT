import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_EFFECTS_ENDPOINTS = [
    'getStateEffects',
    'postEffect',
    'patchEffect',
    'deleteEffect',
] as const

type IEndpoint = (typeof API_EFFECTS_ENDPOINTS)[number]

export const API_EFFECTS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getStateEffects: {
        method: 'GET',
        url: 'states' + '/:stateId/' + ENTITY.EFFECTS.API_ROUTE,
    },
    postEffect: {
        method: 'POST',
        url: 'states' + '/:stateId/' + ENTITY.EFFECTS.API_ROUTE,
    },
    patchEffect: {
        method: 'PATCH',
        url: 'states' + '/:stateId/' + ENTITY.EFFECTS.API_ROUTE + '/:id',
    },
    deleteEffect: {
        method: 'DELETE',
        url: 'states' + '/:stateId/' + ENTITY.EFFECTS.API_ROUTE + '/:id',
    },
}
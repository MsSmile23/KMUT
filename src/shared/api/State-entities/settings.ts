import { IApiEntityScheme } from '../../lib/ApiSPA'

export const API_STATES_ENTITIES_ENDPOINTS = ['getStateEntities'] as const

type IEndpoint = (typeof API_STATES_ENTITIES_ENDPOINTS)[number]

export const API_STATES_ENTITIES: IApiEntityScheme<IEndpoint> = {
    getStateEntities: {
        method: 'GET',
        url: 'states/entities',
    },
}
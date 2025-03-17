import { ENTITY } from '@shared/config/entities'
import { IApiEntityScheme } from '@shared/lib/ApiSPA'

export const API_ACTIONS_ENDPOINTS = [
    'getProbes',
    'runProbes',
] as const

type IEndpoint = (typeof API_ACTIONS_ENDPOINTS)[number]

export const API_ACTIONS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getProbes: {
        method: 'GET',
        url: ENTITY.ACTIONS.API_ROUTE + '/search',
    },
    runProbes: {
        method: 'GET',
        url: ENTITY.ACTIONS.API_ROUTE + '/run/:id',
    },
}
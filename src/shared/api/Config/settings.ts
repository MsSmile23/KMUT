import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_CONFIG_ENDPOINTS = [
    'getConfig',
    'getConfigByMnemo',
    'postConfig',
    'patchConfigByMnemo',
    'deleteConfigByMnemo',
] as const

type IEndpoint = (typeof API_CONFIG_ENDPOINTS)[number]

export const API_CONFIG_SCHEME: IApiEntityScheme<IEndpoint> = {
    getConfig: {
        method: 'GET',
        url: ENTITY.CONFIG.API_ROUTE,
    },
    getConfigByMnemo: {
        method: 'GET',
        url: ENTITY.CONFIG.API_ROUTE + '/:mnemo',
    },
    postConfig: {
        method: 'POST',
        url: ENTITY.CONFIG.API_ROUTE,
    },
    patchConfigByMnemo: {
        method: 'PATCH',
        url: ENTITY.CONFIG.API_ROUTE + '/:mnemo',
    },
    deleteConfigByMnemo: {
        method: 'DELETE',
        url: ENTITY.CONFIG.API_ROUTE + '/:mnemo',
    },
}
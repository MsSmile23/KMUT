import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_LICENSES_ENDPOINTS = [
    'getLicense',
    'postLicense',
    'getSnapshot'
] as const

type IEndpoint = (typeof API_LICENSES_ENDPOINTS)[number]

export const API_LICENSES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getLicense: {
        method: 'GET',
        url: ENTITY.LICENSE.API_ROUTE

    },
    getSnapshot: {
        method: 'GET',
        url: ENTITY.LICENSE.API_ROUTE + '/snapshot',
    },
    postLicense: {
        method: 'POST',
        url: ENTITY.LICENSE.API_ROUTE,
    },
}
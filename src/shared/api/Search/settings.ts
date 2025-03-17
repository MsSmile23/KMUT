import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_SEARCH_ENDPOINTS = [
    'getSearch',
] as const

type IEndpoint = (typeof API_SEARCH_ENDPOINTS)[number]

export const API_SEARCH_SCHEME: IApiEntityScheme<IEndpoint> = {
    getSearch: {
        method: 'GET',
        url: ENTITY.SEARCH.API_ROUTE,
    },
}
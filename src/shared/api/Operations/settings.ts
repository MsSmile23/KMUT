import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_OPERATIONS_ENDPOINTS = [
    'getOperations'
] as const

type IEndpoint = (typeof API_OPERATIONS_ENDPOINTS)[number]

export const API_OPERATIONS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getOperations: {
        method: 'GET',
        url: ENTITY.OPERATIONS.API_ROUTE,
    },

}
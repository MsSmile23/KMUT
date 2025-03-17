import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_DATA_TYPES_ENDPOINTS = ['getDataTypes', 'getDataTypesById'] as const

type IEndpoint = (typeof API_DATA_TYPES_ENDPOINTS)[number]

export const API_DATA_TYPES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getDataTypes: {
        method: 'GET',
        url: ENTITY.DATA_TYPE.API_ROUTE,
    },
    getDataTypesById: {
        method: 'GET',
        url: ENTITY.DATA_TYPE.API_ROUTE + '/:id',
    },
}
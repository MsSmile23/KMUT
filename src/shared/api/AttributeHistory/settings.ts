import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_ATRIBUTE_HISTORY_ENDPOINTS = [
    'getAttributeHistoryById',
    'getAttributeHistoryProbeById',
] as const

type IEndpoint = (typeof API_ATRIBUTE_HISTORY_ENDPOINTS)[number]

export const API_ATRIBUTE_HISTORY_SCHEME: IApiEntityScheme<IEndpoint> = {
    getAttributeHistoryById: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE_HISTORY.API_ROUTE + '/:id',
    },
    getAttributeHistoryProbeById: {
        method: 'GET',
        url: ENTITY.ATTRIBUTE_HISTORY.API_ROUTE + '/:id' + '/probe',
    },
}
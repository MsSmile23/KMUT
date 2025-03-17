import { ENTITY } from '@shared/config/entities'
import { IApiEntityScheme } from '@shared/lib/ApiSPA'

export const API_STATE_STEREOTYPES_ENDPOINTS = ['getStateStereoTypes'] as const

type IEndpoint = (typeof API_STATE_STEREOTYPES_ENDPOINTS)[number]

export const API_STATE_STEREOTYPES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getStateStereoTypes: {
        method: 'GET',
        url: ENTITY.STATE_STEREOTYPES.API_ROUTE,
    },
}
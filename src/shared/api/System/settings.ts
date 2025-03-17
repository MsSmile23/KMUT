import { IApiEntityScheme } from '../../lib/ApiSPA'

export const API_LOGIN_ENDPOINTS = ['getSystem', 'getHealth'] as const

type IEndpoint = (typeof API_LOGIN_ENDPOINTS)[number]

export const API_LOGIN: IApiEntityScheme<IEndpoint> = {
    getSystem: {
        method: 'GET',
        url: 'system',
    },
    getHealth: {
        method: 'GET',
        url: '/system/check-health',
    },
}
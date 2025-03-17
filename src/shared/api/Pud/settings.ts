import { IApiEntityScheme } from '../../lib/ApiSPA'

export const API_REGISTRATION_ENDPOINTS = [
    'getProtocols',
    'createQuickConnection',
] as const

type IEndpoint = (typeof API_REGISTRATION_ENDPOINTS)[number]

export const API_PUD_SCHEME: IApiEntityScheme<IEndpoint> = {
    getProtocols: {
        method: 'GET',
        url: 'pud/getProtocols',
    },
    createQuickConnection: {
        method: 'POST',
        url: 'pud/createQuickConnection',
    },
}
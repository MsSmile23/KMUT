import { IApiEntityScheme } from '../../lib/ApiSPA'

export const API_LOGIN_ENDPOINTS = ['login'] as const

type IEndpoint = (typeof API_LOGIN_ENDPOINTS)[number]

export const API_LOGIN: IApiEntityScheme<IEndpoint> = {
    login: {
        method: 'POST',
        url: 'login',
    },
}
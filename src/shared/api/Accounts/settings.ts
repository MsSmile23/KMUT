import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_ACCOUNTS_ENDPOINTS = [
    'getAccounts',
    'getAccountById',
    'postAccounts',
    'patchAccountById',
    'deleteAccountById',
    'patchAccountMyself',
    'getAccountMyself'
] as const

type IEndpoint = (typeof API_ACCOUNTS_ENDPOINTS)[number]

export const API_ACCOUNTS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getAccounts: {
        method: 'GET',
        url: ENTITY.ACCOUNT.API_ROUTE,
    },
    getAccountMyself: {
        method: 'GET',
        url: ENTITY.ACCOUNT.API_ROUTE + '/myself',
    },
    getAccountById: {
        method: 'GET',
        url: ENTITY.ACCOUNT.API_ROUTE + '/:id',
    },
    postAccounts: {
        method: 'POST',
        url: ENTITY.ACCOUNT.API_ROUTE,
    },
    patchAccountById: {
        method: 'PATCH',
        url: ENTITY.ACCOUNT.API_ROUTE + '/:id',
    },
    deleteAccountById: {
        method: 'DELETE',
        url: ENTITY.ACCOUNT.API_ROUTE + '/:id',
    },
    patchAccountMyself: {
        method: 'PATCH',
        url: ENTITY.ACCOUNT.API_ROUTE + '/myself',
    },

}
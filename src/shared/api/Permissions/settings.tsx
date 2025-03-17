import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_PERMISSIONS_ENDPOINTS = [
    'getPermissions',

] as const

type IEndpoint = (typeof API_PERMISSIONS_ENDPOINTS)[number]

export const API_PERMISSIONS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getPermissions: {
        method: 'GET',
        url: ENTITY.PERMISSIONS.API_ROUTE,
    },

}
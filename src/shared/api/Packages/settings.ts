import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_PACKAGES_ENDPOINTS = [
    'getPackages',
    'getPackageById',
] as const

type IEndpoint = (typeof API_PACKAGES_ENDPOINTS)[number]

export const API_PACKAGES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getPackages: {
        method: 'GET',
        url: ENTITY.PACKAGE.API_ROUTE,
    },
    getPackageById: {
        method: 'GET',
        url: ENTITY.PACKAGE.API_ROUTE + '/:id',
    },
}
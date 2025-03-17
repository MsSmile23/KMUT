import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_SEEDER_PACKAGES_ENDPOINTS = ['getSeederPacks', 'postSeederPackage'] as const

type IEndpoint = (typeof API_SEEDER_PACKAGES_ENDPOINTS)[number]

export const API_SEEDER_PACKAGES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getSeederPacks: {
        method: 'GET',
        url: ENTITY.SEEDER_PACKAGES.API_ROUTE,
    },
    postSeederPackage: {
        method: 'POST', 
        url: ENTITY.SEEDER_PACKAGES.API_ROUTE
    }
}
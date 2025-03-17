import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_LINKS_ENDPOINTS = ['getLinks', 'postLinks', 'patchLinksById', 'postLinksSyncObjects'] as const

type IEndpoint = (typeof API_LINKS_ENDPOINTS)[number]

export const API_LINKS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getLinks: {
        method: 'GET',
        url: ENTITY.LINKS.API_ROUTE,
    },
    postLinks: {
        method: 'POST',
        url: ENTITY.LINKS.API_ROUTE,
    },
    patchLinksById: {
        method: 'PATCH',
        url: ENTITY.LINKS.API_ROUTE + '/:id',
    },
    postLinksSyncObjects: {
        method: 'POST',
        url: ENTITY.LINKS.API_ROUTE + '/sync-objects',
    }
}
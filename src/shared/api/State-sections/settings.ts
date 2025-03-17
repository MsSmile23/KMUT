import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_STATE_SECTIONS_ENDPOINTS = [
    'getStatesSections',
    'getStateSectionById',
    'postStateSection',
    'patchStateSectionById',
    'putStateSectionById',
    'deleteStateSectionById',
] as const

type IEndpoint = (typeof API_STATE_SECTIONS_ENDPOINTS)[number]

export const API_STATE_SECTIONS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getStatesSections: {
        method: 'GET',
        url: ENTITY.STATE_SECTIONS.API_ROUTE,
    },
    getStateSectionById: {
        method: 'GET',
        url: ENTITY.STATE_SECTIONS.API_ROUTE + '/:id',
    },
    postStateSection: {
        method: 'POST',
        url: ENTITY.STATE_SECTIONS.API_ROUTE,
    },
    patchStateSectionById: {
        method: 'PATCH',
        url: ENTITY.STATE_SECTIONS.API_ROUTE + '/:id',
    },
    putStateSectionById: {
        method: 'PUT',
        url: ENTITY.STATE_SECTIONS.API_ROUTE + '/:id',
    },
    deleteStateSectionById: {
        method: 'DELETE',
        url: ENTITY.STATE_SECTIONS.API_ROUTE + '/:id',
    },
}
import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_OBJECTS_ENDPOINTS = [
    'getObjects',
    'getObjectById',
    'getObjectStateHistory',
    'getNotifications',
    'getNotificationsStartFrom',
    'postObjects',
    'patchObjectById',
    'putObjectById',
    'deleteObjectById',
    'createManyObjects',
    'postDefineDiscovery',
    'getObjectAttribute',
    'patchObjectAttribute',
    'getObjectAttributes',
    'getDiscoveredObjects',
    'getObjectsByClassId',
    'getObjectsStatuses',
    'searchObjects',
    'getFilteredObjects'
] as const

type IEndpoint = (typeof API_OBJECTS_ENDPOINTS)[number]

export const API_OBJECTS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getObjects: {
        method: 'GET',
        url: ENTITY.OBJECT.API_ROUTE,
    },
    getObjectById: {
        method: 'GET',
        url: ENTITY.OBJECT.API_ROUTE + '/:id',
    },
    getObjectStateHistory: {
        method: 'GET',
        url: `${ENTITY.OBJECT.API_ROUTE}/:id/state-history`,
    },
    getNotifications: {
        method: 'GET',
        url: `${ENTITY.OBJECT.API_ROUTE}/notifications`,
    },
    getNotificationsStartFrom: {
        method: 'GET',
        // todo: обновить метод на payload
        url: `${ENTITY.OBJECT.API_ROUTE}/notifications?last_message_id=nid`,
    },
    postObjects: {
        method: 'POST',
        url: ENTITY.OBJECT.API_ROUTE,
    },
    patchObjectById: {
        method: 'PATCH',
        url: ENTITY.OBJECT.API_ROUTE + '/:id',
    },
    putObjectById: {
        method: 'PUT',
        url: ENTITY.OBJECT.API_ROUTE + '/:id',
    },
    deleteObjectById: {
        method: 'DELETE',
        url: ENTITY.OBJECT.API_ROUTE + '/:id',
    },
    createManyObjects: {
        method: 'POST',
        url: ENTITY.OBJECT.API_ROUTE + '/create-anonymous',
    },
    postDefineDiscovery: {
        method: 'POST',
        url: `${ENTITY.OBJECT.API_ROUTE}/define-discovery`,
    },
    getObjectAttribute: {
        method: 'GET',
        url: `${ENTITY.OBJECT.API_ROUTE}/attributes/:id`,
    },
    patchObjectAttribute: {
        method: 'PATCH',
        url: `${ENTITY.OBJECT.API_ROUTE}/attributes/:id`,
    },
    getObjectAttributes: {
        method: 'GET',
        url: `${ENTITY.OBJECT.API_ROUTE}/attributes`,
    },
    getDiscoveredObjects: {
        method: 'GET',
        url: `${ENTITY.OBJECT.API_ROUTE}/discovered`,
    },

    getObjectsByClassId: {
        method: 'GET',
        url: `${ENTITY.OBJECT.API_ROUTE}`
    },
    getObjectsStatuses: {
        method: 'POST',
        url: '/voshod/object-statuses',
    },
    searchObjects: {
        method: 'GET',
        url: '/search-objects'
    },
    getFilteredObjects: {
        method: 'POST',
        url: '/voshod/objects-ids'
    },
}
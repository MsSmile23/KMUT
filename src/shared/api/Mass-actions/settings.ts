import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_MASS_ACTIONS_ENDPOINTS = [
    'getMassActions',
    'getMassActionById',
    'postMassAction',
    'runMassAction',
    'deleteMassAction',
] as const

type IEndpoint = (typeof API_MASS_ACTIONS_ENDPOINTS)[number]

export const API_MASS_ACTIONS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getMassActions: {
        method: 'GET',
        url: ENTITY.MASS_ACTIONS.API_ROUTE,
    },
    getMassActionById: {
        method: 'GET',
        url: ENTITY.MASS_ACTIONS.API_ROUTE + '/:id',
    },
    postMassAction: {
        method: 'POST',
        url: ENTITY.MASS_ACTIONS.API_ROUTE,
    },
    runMassAction: {
        method: 'PUT',
        url: ENTITY.MASS_ACTIONS.API_ROUTE + '/:id' + '/run',
    },
    deleteMassAction: {
        method: 'DELETE',
        url: ENTITY.MASS_ACTIONS.API_ROUTE + '/:id',
    },
}
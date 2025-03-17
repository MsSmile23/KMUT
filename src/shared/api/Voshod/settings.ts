import { ENTITY } from '@shared/config/entities';
import { IApiEntityScheme } from '@shared/lib/ApiSPA';

export const API_VOSHOD_ENDPOINTS = ['postFilters', 'postRegionStatuses', 'postMassFails'] as const

type IEndpoint = (typeof API_VOSHOD_ENDPOINTS)[number]

export const API_VOSHOD: IApiEntityScheme<IEndpoint> = {
    postFilters: {
        method: 'POST',
        url: ENTITY.VOSHOD.API_ROUTE + '/filters',
    },
    postRegionStatuses: {
        method: 'POST',
        url: ENTITY.VOSHOD.API_ROUTE + '/regions-statuses',  
    },
    postMassFails: {
        method: 'POST',
        url: ENTITY.VOSHOD.API_ROUTE + '/mass-fails',
    }
}
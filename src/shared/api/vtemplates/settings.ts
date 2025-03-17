// import {IApiEntityScheme, ISchemeMethod} from '@api/ApiCore/types/shared';
// import {ENTITY_VTEMPLATES} from '../index';


// type IEndpoint = Record<typeof API_VTEMPLATES_ENDPOINTS[number],ISchemeMethod>;

// export const API_VTEMPLATES_ENDPOINTS = [
//     "getVtemplates",
//     "postVtemplates",
//     "patchVtemplates"
// ] as const;

// const entity = ENTITY_VTEMPLATES;

// export const API_VTEMPLATES_SCHEME: IApiEntityScheme<IEndpoint> = {
//     entity: ENTITY_VTEMPLATES.MNEMOS.api,
//     endpoints: {
//         getVtemplates: {
//             method: "GET",
//             url: ENTITY_VTEMPLATES.MNEMOS.api
//         },
//         postVtemplates: {
//             method:"POST",
//             url: ENTITY_VTEMPLATES.MNEMOS.api
//         },
//         patchVtemplates: {
//             method:"PATCH",
//             url: ENTITY_VTEMPLATES.MNEMOS.api
//         }
//     }
// };

import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_VTEMPLATES_ENDPOINTS = [
    'postVtemplates', 
    'patchVtemplates', 
    'getVtemplates', 
    'getVtemplatesById',
    'deleteVtemplatesById'
] as const

type IEndpoint = (typeof API_VTEMPLATES_ENDPOINTS)[number]

export const API_VTEMPLATES_SCHEME: IApiEntityScheme<IEndpoint> = {
    postVtemplates: {
        method: 'POST',
        url: ENTITY.VTEMPLATES.API_ROUTE,
    },
    patchVtemplates: {
        method: 'PATCH',
        url: ENTITY.VTEMPLATES.API_ROUTE + '/:id',
    },
    getVtemplates: {
        method: 'GET',
        url: ENTITY.VTEMPLATES.API_ROUTE
    },
    getVtemplatesById: {
        method: 'GET',
        url: ENTITY.VTEMPLATES.API_ROUTE + '/:id',
    },
    deleteVtemplatesById: {
        method: 'DELETE',
        url: ENTITY.VTEMPLATES.API_ROUTE + '/:id',
    }
}
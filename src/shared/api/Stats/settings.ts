/* eslint-disable  */

import { ENTITIES } from '@shared/config/entities/entities';
import { IApiEntityScheme } from '@shared/lib/ApiSPA';
import { Method } from 'axios';

type IEndpoint = typeof API_STATS_ENDPOINTS[number];
const ENTITY = { ...ENTITIES.STATS };
export const API_STATS_ENDPOINTS = [
    `getBandCurrent`,
    `getUtilCurrent`,
    'getUserActivity',
    'getUserActivityTop',
    'getBrowserHistoryTop',
    'getProcessTop',
    'getCheckNetChart',
    'getSumObjectAttributes',
    'getIncidentChart',
    'getAttributeCountStrings',
    'getAttributeAggregation',
    'getFrequentFalls',
    'getDurationIncidents',
    'getAggregationIncidents'
] as const;

export const API_STATS_SCHEME: {
    entity: string
    endpoints: Record<typeof API_STATS_ENDPOINTS[number], { method: Method, url: string }>
} = {
    entity: ENTITY.MNEMO,
    endpoints: {
        getBandCurrent: {
            method: "GET",
            url: ENTITY.API_ROUTE + '/band'
        },
        getUtilCurrent: {
            method: "GET",
            url: ENTITY.API_ROUTE + '/util'
        },
        getUserActivity: {
            method: "GET",
            url: ENTITY.API_ROUTE + '/user-activity'
        },
        getUserActivityTop: {
            method: "GET",
            url: ENTITY.API_ROUTE + '/user-activity-top'
        },
        getBrowserHistoryTop: {
            method: "GET",
            url: ENTITY.API_ROUTE + '/browser-history-top'
        },
        getProcessTop: {
            method: "GET",
            url: ENTITY.API_ROUTE + '/process-top'
        },
        getCheckNetChart: {
            method: "GET",
            url: ENTITY.API_ROUTE + '/check-net-chart'
        },
        getSumObjectAttributes: {
            method: 'GET',
            url: ENTITY.API_ROUTE + '/sum-object-attributes'
        },
        getIncidentChart: {
            method: 'GET',
            url: ENTITY.API_ROUTE + '/incident-chart'
        },
        getAttributeCountStrings: {
            method: 'GET',
            url: ENTITY.API_ROUTE + '/attribute-count-strings'
        },
        getAttributeAggregation: {
            method: 'GET',
            url: ENTITY.API_ROUTE + '/attribute-aggregation'
        },
        getFrequentFalls: {
            method: 'POST',
            url: ENTITY.API_ROUTE + '/frequent-falls'
        },
        getDurationIncidents: {
            method: 'POST',
            url: ENTITY.API_ROUTE + '/duration-incidents'
        },
        getAggregationIncidents: {
            method: 'POST',
            url: ENTITY.API_ROUTE +  '/aggregation-incidents'
        }
    }
}
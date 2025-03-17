import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { IIncident } from '@shared/types/incidents'

export const incidentsApi = {
    baseUrl: '/incidents',
    getIncidents: async (payload: Record<string, string | number | boolean>): Promise<IApiReturn<IIncident[]>> => {
        return API.apiGetAsArray<IIncident[]>({
            payload,
            endpoint: {
                url: incidentsApi.baseUrl,
                method: 'GET'
            }
        })
    },
    getIncidentById: async (id: number): Promise<IApiReturn<IIncident>> => {
        return API.apiQuery<IIncident>({
            method: 'GET',
            url: `${incidentsApi.baseUrl}/:id`.replace(':id', `${id}`),
        })
    }
}
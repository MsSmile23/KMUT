import { API } from '@shared/lib/ApiSPA';
import { API_STATS_SCHEME } from '../../settings';
import { IIncidentData, IIncidentPayload, /* IStatsPayload */ } from '@shared/types/stats';
import { convertToSearchParams } from '@shared/utils/stats';

export const getIncidentChart = async (payload: IIncidentPayload) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getIncidentChart };
    const response = await API.apiQuery<IIncidentData>({ 
        method: endpoint.method, 
        url: endpoint.url + '?' + convertToSearchParams(payload as any) });

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    }
}
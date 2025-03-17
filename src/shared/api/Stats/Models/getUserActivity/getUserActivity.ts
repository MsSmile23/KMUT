import { API } from '@shared/lib/ApiSPA';
import { API_STATS_SCHEME } from '../../settings';
import { IStatsPayload } from '@shared/types/stats';
import { convertToSearchParams } from '@shared/utils/stats';

export const getUserActivity = async (payload: IStatsPayload) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getUserActivity };
    const response = await API.apiQuery<any>({ 
        method: endpoint.method, 
        url: endpoint.url + '?' + convertToSearchParams(payload as any) });

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    };
};
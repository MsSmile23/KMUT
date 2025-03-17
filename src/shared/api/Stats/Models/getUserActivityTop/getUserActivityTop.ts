import { API } from '@shared/lib/ApiSPA';
import { API_STATS_SCHEME } from '../../settings';
import { IStatsPayload, ITopResponseData } from '@shared/types/stats';
import { convertToSearchParams } from '@shared/utils/stats';

export const getUserActivityTop = async (payload: IStatsPayload) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getUserActivityTop };
    const response = await API.apiQuery<ITopResponseData>({ 
        method: endpoint.method, 
        url: endpoint.url + '?' + convertToSearchParams(payload as any) });

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    };
};
import { API } from '@shared/lib/ApiSPA';
import { API_STATS_SCHEME } from '../../settings';
import { ICheckNetChartPayload } from '@shared/types/stats';
import { convertToSearchParams } from '@shared/utils/stats';

export const getCheckNetChart = async (payload: Partial<ICheckNetChartPayload>) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getCheckNetChart };
    const response = await API.apiQuery<any>({ 
        method: endpoint.method, 
        url: endpoint.url + '?' + convertToSearchParams(payload as any) });

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    };
};
import {  IFrequentFallsData, IFrequentFallsPayload } from '@shared/types/stats';
import { API_STATS_SCHEME } from '../../settings';
import { API } from '@shared/lib/ApiSPA';
import { convertToSearchParams } from '@shared/utils/stats';

export const getFrequentFalls = async (payload: IFrequentFallsPayload) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getFrequentFalls };
    const response = await API.apiQuery<IFrequentFallsData[]>({ 
        method: endpoint.method, 
        //url: endpoint.url + '?' + convertToSearchParams(payload as any)
        url: endpoint.url,
        data: payload
    });

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    }
}
import { API } from '@shared/lib/ApiSPA'
import { API_STATS_SCHEME } from '../../settings'
import { convertToSearchParams } from '@shared/utils/stats';
import { IAttributeCountStringsDataItem, IAttributeCountStringsPayload } from '@shared/types/stats';



export const getAttributeCountStrings = async (payload: IAttributeCountStringsPayload) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getAttributeCountStrings };
    const response = await API.apiQuery<IAttributeCountStringsDataItem[]>({ 
        method: endpoint.method, 
        url: endpoint.url + '?' + convertToSearchParams(payload as any) });

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    }
}
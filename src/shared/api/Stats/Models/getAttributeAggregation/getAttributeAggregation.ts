import { API } from '@shared/lib/ApiSPA';
import { API_STATS_SCHEME } from '../../settings';
import { convertToSearchParams } from '@shared/utils/stats';
import { IAttributeAggregationDataItem, IAttributeAggregationPayload } from '@shared/types/stats';


export const getAttributeAggregation = async (payload: IAttributeAggregationPayload) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getAttributeAggregation }
    const response = await API.apiQuery<IAttributeAggregationDataItem>({ 
        method: endpoint.method, 
        url: endpoint.url + '?' + convertToSearchParams(payload as any) }) 

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    }
}
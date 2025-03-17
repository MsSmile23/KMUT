/* eslint-disable */

import { PAYLOAD_DEFAULT_GET } from '@shared/api/const';
import { API, IApiGetPayload } from '@shared/lib/ApiSPA';
import { API_STATS_SCHEME } from '../../settings';
import { convertToSearchParams } from '@shared/utils/stats';

export const getSumObjectAttributes = async (payload: {
    class_id: number
    attribute_id: number
}) => {
    const endpoint = { ...API_STATS_SCHEME.endpoints.getSumObjectAttributes };
    const response = await API.apiQuery<any>({ 
        method: endpoint.method, 
        url: endpoint.url + '?' + convertToSearchParams(payload as any) });

    return {
        success: response?.success ?? false,
        data: response?.data,
        error: response?.error ?? undefined,
    };
};
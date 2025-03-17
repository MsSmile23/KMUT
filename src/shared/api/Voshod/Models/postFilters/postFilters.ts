import { API, IApiReturnObject } from '@shared/lib/ApiSPA';
import { API_VOSHOD } from '../../settings';
import { IVoshodFilter } from '@shared/types/voshod-filters';



export const postFilters = async (
    payload: { filters: IVoshodFilter[] }, // TODO
): Promise<IApiReturnObject<IVoshodFilter[]>> => {
    const endpoint = { ...API_VOSHOD.postFilters }

    const response = await API.apiQuery<IVoshodFilter[]>(
        {
            method: endpoint.method,
            url: endpoint.url,
            data: payload
        }
    );

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    }
}
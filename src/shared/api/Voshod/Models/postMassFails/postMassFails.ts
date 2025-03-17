import { API, IApiReturnObject } from '@shared/lib/ApiSPA';
import { IMassFailsRegion, IVoshodFilter } from '@shared/types/voshod-filters';
import { API_VOSHOD } from '../../settings';



export const postMassFails = async (
    payload: { filters: IVoshodFilter[] },
): Promise<IApiReturnObject<IMassFailsRegion[]>> => {
    const endpoint = { ...API_VOSHOD.postMassFails }

    const response = await API.apiQuery<IMassFailsRegion[]>(
        {
            method: endpoint.method,
            url: endpoint.url,
            data: payload
        }
    )

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    }
}
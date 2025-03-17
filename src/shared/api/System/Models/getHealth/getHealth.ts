
import { API_LOGIN } from '@shared/api/System/settings';
import { API, IApiReturnObject } from '@shared/lib/ApiSPA'

type THealth = { status: number, message: string }

export const getHealth = async (): Promise<IApiReturnObject<THealth>> => {
    const endpoint = API_LOGIN.getHealth
    const response = await API.apiQuery<THealth>({ 
        method: endpoint.method,
        url: endpoint.url,
        extraConfig: { 
            //signal: AbortSignal.timeout(11000)
        }
    });

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    };
};
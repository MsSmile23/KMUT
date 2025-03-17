import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { IEffectPost, IEffects } from '@shared/types/effects'
import { API_EFFECTS_SCHEME } from '../../settings'


export const postEffect = async (
    stateId: string,
    payload: IEffectPost
): Promise<IApiReturn<IEffects | undefined>> => {
    const endpoint = { ...API_EFFECTS_SCHEME.postEffect };
    const url = endpoint.url.replace(':stateId', stateId)


    const response = await API.apiQuery<IEffects>(
        {
            method: endpoint.method,
            url: url,
            data: payload
        }
    );


    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    };
}
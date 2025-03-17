import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { IEffectPost, IEffects } from '@shared/types/effects'
import { API_EFFECTS_SCHEME } from '../../settings'


interface ILocalPayload {
    id: string,
    stateId: string,
    data: IEffectPost
}
export const patchEffect = async (
    payload: ILocalPayload
): Promise<IApiReturn<IEffects | undefined>> => {
    const endpoint = { ...API_EFFECTS_SCHEME.patchEffect }
    const url = endpoint.url.replace(':stateId', payload.stateId).replace(':id', payload.id)
    const response = await API.apiQuery<IEffects>({
        method: endpoint.method,
        url: url,
        data: payload.data,
    })

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    }
}
import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { IEffects } from '@shared/types/effects'
import { API_EFFECTS_SCHEME } from '../../settings'


interface ILocalPayload {
    id: string,
    stateId: string,
}
export const deleteEffect = async (
    payload: ILocalPayload
): Promise<IApiReturn<IEffects | undefined>> => {
    const endpoint = { ...API_EFFECTS_SCHEME.deleteEffect }
    const url = endpoint.url.replace(':stateId', payload.stateId).replace(':id', payload.id)
    const response = await API.apiQuery<IEffects>({
        method: endpoint.method,
        url: url,
    })

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    }
}
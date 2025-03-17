import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_CONSTRAINTS_SCHEME } from '../../settings'
import { IConstraint } from '@shared/types/constraints'


interface ILocalPayload {
    id: string,
}
export const deleteConstraint = async (
    payload: ILocalPayload
): Promise<IApiReturn<IConstraint | undefined>> => {
    const endpoint = { ...API_CONSTRAINTS_SCHEME.deleteConstraint }
    const url = endpoint.url.replace(':id', payload.id)
    const response = await API.apiQuery<IConstraint>({
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
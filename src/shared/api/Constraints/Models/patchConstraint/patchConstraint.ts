import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_CONSTRAINTS_SCHEME } from '../../settings'
import { IConstraint } from '@shared/types/constraints'

export const patchConstraint = async (payload: {
    name: string
    describe_rules: string | null
    relation_id: number
    id: number
}): Promise<IApiReturn<Partial<IConstraint> | undefined>> => {
    const endpoint = { ...API_CONSTRAINTS_SCHEME.patchConstraint }
    const url = endpoint.url.replace(':id', String(payload.id))
    const response = await API.apiQuery<IConstraint>({
        method: endpoint.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        errors: response?.errors,
    }
}
import { IConstraint } from '@shared/types/constraints'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_CONSTRAINTS_SCHEME } from '../../settings'

export const postConstraint = async (payload: {name: string, describe_rules: string | null, relation_id: number}):
    Promise<IApiReturn<Partial<IConstraint> | undefined>> => {
    const response = await API.apiQuery<Partial<IConstraint> | undefined>({
        method: API_CONSTRAINTS_SCHEME.postConstraint.method,
        url: API_CONSTRAINTS_SCHEME.postConstraint.url,
        data: payload,
    })

    return {
        ...response,
    }
}
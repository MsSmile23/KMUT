import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_CLASSES_SCHEME } from '../../../Classes/settings'
import { IClassOperations } from '@shared/types/class-operations'

export const putClassOperations = async (
    payload: IClassOperations[]
): Promise<IApiReturn<any | undefined>> => {
    const query = {
        method: API_CLASSES_SCHEME.putClassOperations.method,
        url: API_CLASSES_SCHEME.putClassOperations.url,
        data: { data: { ...payload } },
    }

    const response = await API.apiQuery<IClassOperations[]>(query)

    return {
        ...response,
    }
}
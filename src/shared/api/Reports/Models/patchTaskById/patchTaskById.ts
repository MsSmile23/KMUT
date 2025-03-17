import { TReport } from '@shared/types/reports'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const patchTaskById = async (
    id: string, 
    payload: Partial<TReport>
): Promise<IApiReturn<TReport | undefined>> => {
    return API.apiQuery<TReport>({
        method: API_REPORTS_SCHEME.patchTaskById.method,
        url: API_REPORTS_SCHEME.patchTaskById.url.replace(':id', id),
        data: payload,
    })
}
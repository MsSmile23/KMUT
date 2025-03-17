import { TReport } from '@shared/types/reports'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const patchReportById = async (id: string, payload: TReport): Promise<IApiReturn<TReport | undefined>> => {
    return API.apiQuery<TReport>({
        method: API_REPORTS_SCHEME.patchReportById.method,
        url: API_REPORTS_SCHEME.patchReportById.url.replace(':id', id),
        data: payload,
    })
}
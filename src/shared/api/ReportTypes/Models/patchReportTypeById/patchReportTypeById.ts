import { TReport } from '@shared/types/reports'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORT_TYPES_SCHEME } from '../../settings'

export const patchReportTypeById = async (id: string, payload: TReport): Promise<IApiReturn<TReport | undefined>> => {
    return API.apiQuery<TReport>({
        method: API_REPORT_TYPES_SCHEME.patchReportTypeById.method,
        url: API_REPORT_TYPES_SCHEME.patchReportTypeById.url.replace(':id', id),
        data: payload,
    })
}
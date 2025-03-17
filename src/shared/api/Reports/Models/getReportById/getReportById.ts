import { TReport } from '@shared/types/reports';
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const getReportById = async (id: string | number): Promise<IApiReturn<TReport | undefined>> => {
    return API.apiQuery<TReport>({
        method: API_REPORTS_SCHEME.getReportById.method,
        url: API_REPORTS_SCHEME.getReportById.url.replace(':id', String(id)),
    })
}
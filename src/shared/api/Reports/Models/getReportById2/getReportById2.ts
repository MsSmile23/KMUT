import { TReport } from '@shared/types/reports';
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const getReportById2 = async (id: string | number): Promise<IApiReturn<TReport | undefined>> => {
    return API.apiQuery<TReport>({
        method: API_REPORTS_SCHEME.getReportById2.method,
        url: API_REPORTS_SCHEME.getReportById2.url.replace(':id', String(id)),
    })
}
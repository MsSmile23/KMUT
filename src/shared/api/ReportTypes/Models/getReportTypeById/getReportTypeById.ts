import { TReport } from '@shared/types/reports';
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORT_TYPES_SCHEME } from '../../settings'

export const getReportTypeById = async (id: string | number): Promise<IApiReturn<TReport | undefined>> => {
    return API.apiQuery<TReport>({
        method: API_REPORT_TYPES_SCHEME.getReportTypeById.method,
        url: API_REPORT_TYPES_SCHEME.getReportTypeById.url.replace(':id', String(id)),
    })
}
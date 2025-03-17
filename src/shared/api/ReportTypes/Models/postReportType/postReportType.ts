import { TReport, TReportPayload } from '@shared/types/reports'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORT_TYPES_SCHEME } from '../../settings'

export const postReportType = async (payload: TReportPayload): Promise<IApiReturn<TReport | undefined>> => {
    const response = await API.apiQuery<TReport>({ ...API_REPORT_TYPES_SCHEME.postReportType, data: payload, })

    return {
        ...response,
    }
}
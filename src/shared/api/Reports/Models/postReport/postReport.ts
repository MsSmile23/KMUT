import { TReport, TReportPayload } from '@shared/types/reports'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const postReport = async (payload: TReportPayload): Promise<IApiReturn<TReport | undefined>> => {
    const response = await API.apiQuery<TReport>({ ...API_REPORTS_SCHEME.postReport, data: payload, })

    return {
        ...response,
    }
}
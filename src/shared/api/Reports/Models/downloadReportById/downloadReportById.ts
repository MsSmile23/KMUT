import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const downloadReportById = async (id: number | string, format: string): Promise<IApiReturn<any>> => {

    return API.apiQuery<any>({
        method: API_REPORTS_SCHEME.downloadReportById.method,
        url: API_REPORTS_SCHEME.downloadReportById.url.replace(':id', `${id}`).replace(':format', `${format}`),
        extraConfig: { responseType: 'blob' },
    })
}
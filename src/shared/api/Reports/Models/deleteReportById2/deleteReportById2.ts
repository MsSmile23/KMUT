import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const deleteReportById2 = async (id: number): Promise<IApiReturn<undefined>> => {
    const url = API_REPORTS_SCHEME.deleteReportById2.url.replace(':id', `${id}`)

    return API.apiQuery<undefined>({
        method: API_REPORTS_SCHEME.deleteReportById2.method,
        url: url
    })
}
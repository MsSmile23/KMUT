import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const deleteReportById = async (id: number): Promise<IApiReturn<undefined>> => {
    const url = API_REPORTS_SCHEME.deleteReportById.url.replace(':id', `${id}`)

    return API.apiQuery<undefined>({
        method: API_REPORTS_SCHEME.deleteReportById.method,
        url: url
    })
}
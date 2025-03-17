import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORT_TYPES_SCHEME } from '../../settings'

export const deleteReportTypeById = async (id: number): Promise<IApiReturn<undefined>> => {
    const url = API_REPORT_TYPES_SCHEME.deleteReportTypeById.url.replace(':id', `${id}`)

    return API.apiQuery<undefined>({
        method: API_REPORT_TYPES_SCHEME.deleteReportTypeById.method,
        url: url
    })
}
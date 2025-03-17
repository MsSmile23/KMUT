import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_REPORTS_SCHEME } from '../../settings'

export const deleteTaskById = async (id: number): Promise<IApiReturn<undefined>> => {
    const url = API_REPORTS_SCHEME.deleteTaskById.url.replace(':id', `${id}`)

    return API.apiQuery<undefined>({
        method: API_REPORTS_SCHEME.deleteTaskById.method,
        url: url
    })
}
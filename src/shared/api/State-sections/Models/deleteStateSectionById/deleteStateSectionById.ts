import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_SECTIONS_SCHEME } from '../../settings'


export const deleteStateSectionById = async (id: number): Promise<IApiReturn<any | undefined>> => {
    const url = API_STATE_SECTIONS_SCHEME.deleteStateSectionById.url.replace(':id', `${id}`)

    return API.apiQuery<any>({
        method: API_STATE_SECTIONS_SCHEME.deleteStateSectionById.method,
        url: url
    })
}
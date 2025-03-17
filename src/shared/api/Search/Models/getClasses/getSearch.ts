import { ISearchResponse } from '@shared/types/search'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_SEARCH_SCHEME } from '../../settings'

export const getSearch = async (payload: string): Promise<IApiReturn<ISearchResponse>> => {
    const response = await API.apiQuery<any>({
        method: API_SEARCH_SCHEME.getSearch.method,
        url: `${API_SEARCH_SCHEME.getSearch.url}?search=${payload}`,
    })

    return {
        ...response,
    }
}
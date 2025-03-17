import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { ILink, ILinkPost } from '../../../../types/links'
import { API_LINKS_SCHEME } from '../../settings'

export const postLinks = async (payload: ILinkPost): Promise<IApiReturn<ILink[] | undefined>> => {
    const response = await API.apiQuery<ILink[]>({
        method: API_LINKS_SCHEME.postLinks.method,
        url: API_LINKS_SCHEME.postLinks.url,
        data: payload,
    })

    return {
        ...response,
    }
}
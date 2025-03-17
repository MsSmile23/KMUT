import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { ILink, ILinkPost } from '../../../../types/links'
import { API_LINKS_SCHEME } from '../../settings'

export const postLinksSyncObjects = async (payload: {
    object_id: number,
    links: ILinkPost[]
}): Promise<IApiReturn<any[] | undefined>> => {
    const response = await API.apiQuery<ILink[]>({
        method: API_LINKS_SCHEME.postLinksSyncObjects.method,
        url: API_LINKS_SCHEME.postLinksSyncObjects.url,
        data: payload,
    })

    return {
        ...response,
    }
}

/*


/links/sync-objects
 */
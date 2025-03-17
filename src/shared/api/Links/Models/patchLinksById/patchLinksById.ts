import { API, IApiReturn } from '@shared/lib/ApiSPA'

import { ILink, ILinkPost } from '../../../../types/links'
import { API_LINKS_SCHEME } from '../../settings'

export const patchLinksById = async (id: string, payload: ILinkPost): Promise<IApiReturn<ILink | undefined>> => {
    const url = API_LINKS_SCHEME.patchLinksById.url.replace(':id', id)
    const response = await API.apiQuery<ILink>({
        method: API_LINKS_SCHEME.patchLinksById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
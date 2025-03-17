import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_PUD_SCHEME } from '../../settings'

type Protocols = 'ssh'| 'rdp' | 'vnc'

export const getProtocols = async (
    objectId: number
): Promise<IApiReturn<Protocols[] | []>> => {     

    const url = API_PUD_SCHEME.getProtocols.url + `/${objectId}`

    const response = await API.apiQuery<Protocols[]>(
        { 
            method: API_PUD_SCHEME.getProtocols.method,
            url
        }
    )

    return {
        ...response,
    }
}
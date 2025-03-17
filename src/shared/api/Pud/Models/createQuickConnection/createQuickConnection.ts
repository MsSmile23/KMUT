import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_PUD_SCHEME } from '../../settings'


interface QuickConnectionResponse {
    identifier: number
    token: string
}

export const createQuickConnection = async (
    payload
): Promise<IApiReturn<QuickConnectionResponse | undefined>> => {     

    const response = await API.apiQuery<QuickConnectionResponse>(
        { 
            method: API_PUD_SCHEME.createQuickConnection.method,
            url: API_PUD_SCHEME.createQuickConnection.url,
            data: payload,
        }
    )

    return {
        ...response,
    }
}
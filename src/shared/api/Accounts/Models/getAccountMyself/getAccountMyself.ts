import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAccount } from '../../../../types/accounts'
import { API_ACCOUNTS_SCHEME } from '../../settings'

export const getAccountMyself = async (
): Promise<IApiReturn<IAccount | undefined>> => {
    const url = API_ACCOUNTS_SCHEME.getAccountMyself.url
    
    const response = await API.apiQuery<IAccount>({
        method: API_ACCOUNTS_SCHEME.getAccountMyself.method,
        url: url,
    })

    return {
        ...response,
    }
}
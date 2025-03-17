import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAccount } from '../../../../types/accounts'
import { API_ACCOUNTS_SCHEME } from '../../settings'

export const getAccountById = async (
    id: string
): Promise<IApiReturn<IAccount | undefined>> => {
    const url = API_ACCOUNTS_SCHEME.getAccountById.url.replace(':id', id)
    
    const response = await API.apiQuery<IAccount>({
        method: API_ACCOUNTS_SCHEME.getAccountById.method,
        url: url,
    })

    return {
        ...response,
    }
}
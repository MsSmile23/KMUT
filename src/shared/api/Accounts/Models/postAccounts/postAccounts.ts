import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAccount, IAccountPost } from '../../../../types/accounts'
import { API_ACCOUNTS_SCHEME } from '../../../Accounts/settings'

export const postAccounts = async (
    payload: IAccountPost
): Promise<IApiReturn<IAccount | undefined>> => {
    const response = await API.apiQuery<IAccount>({
        method: API_ACCOUNTS_SCHEME.postAccounts.method,
        url: API_ACCOUNTS_SCHEME.postAccounts.url,
        data: payload,
    })

    return {
        ...response,
    }
}
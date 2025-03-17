import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAccount, IAccountPost } from '../../../../types/accounts'
import { API_ACCOUNTS_SCHEME } from '../../../Accounts/settings'

export const patchAccountById = async (
    id: string,
    payload: Partial<IAccountPost>
): Promise<IApiReturn<IAccount | undefined>> => {
    const url = API_ACCOUNTS_SCHEME.patchAccountById.url.replace(':id', id)

    const response = await API.apiQuery<IAccount>({
        method: API_ACCOUNTS_SCHEME.patchAccountById.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
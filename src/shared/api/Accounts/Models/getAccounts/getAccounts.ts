import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IAccount } from '../../../../types/accounts'
import { API_ACCOUNTS_SCHEME } from '../../../Accounts/settings'

export const getAccounts = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IAccount[]>> => {
    const response = await API.apiGetAsArray<IAccount[]>({
        endpoint: { ...API_ACCOUNTS_SCHEME.getAccounts },
        payload,
    })

    return { ...response }
}
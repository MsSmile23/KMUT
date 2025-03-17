import { useAccountStore } from '@shared/stores/accounts'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IAccount, IAccountPost } from '../../../../types/accounts'
import { API_ACCOUNTS_SCHEME } from '../../../Accounts/settings'

export const patchAccountMyself = async (
    payload?: Partial<IAccountPost>
): Promise<IApiReturn<IAccount | undefined>> => {
    const url = API_ACCOUNTS_SCHEME.patchAccountMyself.url
    //*Находим данные текущего аккаунта и узнаем, есть ли у него доступ к самообновлению
    const accountData = useAccountStore.getState()?.store?.data?.user

    let response: IApiReturn<IAccount | undefined>
    
    if (accountData) {
        if (
            accountData?.role?.permissions?.some((item) => item.name == 'do all') ||
            accountData?.role?.permissions?.some((item) => item.name == 'update myself')
        ) {
            response = await API.apiQuery<IAccount>({
                method: API_ACCOUNTS_SCHEME.patchAccountMyself.method,
                url: url,
                data: payload,
            })
        } else {
            response = {
                success: false,
                error: { message: 'У вашего аккаунта нет доступа к обновлению ' },
                data: undefined,
            }
        }
    }

    return {
        ...response,
    }
}
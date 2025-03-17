import { IConfig } from '@shared/types/config'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_CONFIG_SCHEME } from '../../settings'

export const getConfigByMnemo = async (mnemo: string): Promise<IApiReturn<IConfig | undefined>> => {
    return API.apiQuery<IConfig>({
        method: API_CONFIG_SCHEME.getConfigByMnemo.method,
        url: API_CONFIG_SCHEME.getConfigByMnemo.url.replace(':mnemo', mnemo),
    })
}
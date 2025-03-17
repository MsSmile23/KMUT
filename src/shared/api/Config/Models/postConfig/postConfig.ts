import { IConfig } from '@shared/types/config'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_CONFIG_SCHEME } from '../../settings'

export const postConfig = async (payload: IConfig): Promise<IApiReturn<IConfig | undefined>> => {
    return API.apiQuery<IConfig>({
        method: API_CONFIG_SCHEME.postConfig.method,
        url: API_CONFIG_SCHEME.postConfig.url,
        data: payload,
    })
}
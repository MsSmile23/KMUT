import { IConfig } from '@shared/types/config'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_CONFIG_SCHEME } from '../../settings'

export const patchConfigByMnemo = async (
    mnemo: string,
    payload: Partial<IConfig>
): Promise<IApiReturn<IConfig | undefined>> => API.apiQuery<IConfig>({
    method: API_CONFIG_SCHEME.patchConfigByMnemo.method,
    url: API_CONFIG_SCHEME.patchConfigByMnemo.url.replace(':mnemo', mnemo),
    data: payload,
})
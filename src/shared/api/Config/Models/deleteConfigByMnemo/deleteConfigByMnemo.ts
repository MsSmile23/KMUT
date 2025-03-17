import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_CONFIG_SCHEME } from '../../settings'

export const deleteConfigByMnemo = async (mnemo: string): Promise<IApiReturn<
    { statusText: 'Deleted' } | undefined
>> => {
    return API.apiQuery<{ statusText: 'Deleted' }>({
        method: API_CONFIG_SCHEME.deleteConfigByMnemo.method,
        url: API_CONFIG_SCHEME.deleteConfigByMnemo.url.replace(':mnemo', mnemo),
    })
}
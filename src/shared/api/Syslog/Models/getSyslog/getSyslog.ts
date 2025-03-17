import { ISyslog } from '@shared/types/states'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_SYSLOG_SCHEME } from '../../settings'

export const getSyslog = async (
    queryParams?: Record<string, string | number | boolean>
): Promise<IApiReturn<ISyslog[]>> => {
    const response = await API.apiGetAsArray<ISyslog[]>({
        endpoint: { 
            ...API_SYSLOG_SCHEME.getSyslog,
            url: `${API_SYSLOG_SCHEME.getSyslog.url}` 
        },
        payload: queryParams
    })

    return { ...response }
}
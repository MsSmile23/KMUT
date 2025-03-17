import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IConfig } from '@shared/types/config'
import { API_CONFIG_SCHEME } from '../../settings'

export const getConfig = async (payload: IApiGetPayload = PAYLOAD_DEFAULT_GET): Promise<IApiReturn<IConfig[]>> => {
    return API.apiGetAsArray<IConfig[]>({
        endpoint: { ...API_CONFIG_SCHEME.getConfig },
        payload,
    })
}
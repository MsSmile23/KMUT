
import { IObjectAttribute } from '@shared/types/objects'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_OBJECTS_SCHEME } from '../../../Objects/settings'

export const getObjectAttributes = async (
    payload: any = PAYLOAD_DEFAULT_GET,
    
): Promise<IApiReturn<IObjectAttribute[]>> => {
    const response = await API.apiGetAsArray<IObjectAttribute[]>({
        endpoint: { ...API_OBJECTS_SCHEME.getObjectAttributes },
        payload,
    })

    return { ...response }
}
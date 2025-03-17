import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'

import { API_OBJECTS_SCHEME } from '../../../Objects/settings'
import { IObject } from '@shared/types/objects';


export interface IDiscoveredObject extends IObject{
    discoveryMatchedObjects: {class_id: number, codename: string, id: number, name: string}[]

}
export const getDiscoveredObjects = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IDiscoveredObject[]>> => {
    const response = await API.apiGetAsArray<IDiscoveredObject[]>({
        endpoint: { ...API_OBJECTS_SCHEME.getDiscoveredObjects },
        payload,
    })

    return { ...response }
}
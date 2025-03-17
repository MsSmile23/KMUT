import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_RELATIONS_SCHEME } from '../../settings'
import { IRelation } from '../../../../types/relations'

export const getRelations = async (payload: IApiGetPayload = PAYLOAD_DEFAULT_GET): Promise<IApiReturn<IRelation[]>> => {
    const endpoint = { ...API_RELATIONS_SCHEME.getRelations }
    const response = await API.apiGetAsArray<IRelation[]>({
        endpoint: endpoint,
        payload,
    })

    // const dublicat = [...response.data].slice()
    // const filteredArr = dublicat.map(obj => {
    //     ['left_class', 'right_class'].forEach(prop => delete obj[prop]);

    //     return obj;
    // });

    //      console.log('newItems2', filteredArr[0]);

    return { ...response };
}
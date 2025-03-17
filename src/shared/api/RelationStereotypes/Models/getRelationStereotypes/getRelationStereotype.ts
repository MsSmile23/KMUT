import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_RELATION_STEREOTYPES_SCHEME } from '../../settings'
import { IRelationStereotype } from '@shared/types/relation-stereotypes'

export const getRelationStereotypes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IRelationStereotype[]>> => {
    const response = await API.apiGetAsArray<IRelationStereotype[]>({
        endpoint: { ...API_RELATION_STEREOTYPES_SCHEME.getRelationStereotypes },
        payload,
    })

    return { ...response }
}
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_CONSTRAINTS_SCHEME } from '../../settings'
import { IConstraint } from '@shared/types/constraints'

export const getConstraints = async (
    payload: IApiGetPayload  & {
        relation_id?: number; 
    } = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IConstraint[]>> => {
    const response = await API.apiGetAsArray<IConstraint[]>({
        endpoint: { ...API_CONSTRAINTS_SCHEME.getConstraints },
        payload,
    })

    return { ...response }
}
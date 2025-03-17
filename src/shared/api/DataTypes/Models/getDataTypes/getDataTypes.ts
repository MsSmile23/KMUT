import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IDataType } from '../../../../types/data-types'
import { API_DATA_TYPES_SCHEME } from '../../../DataTypes/settings'

export const getDataTypes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IDataType[]>> => {
    const response = await API.apiGetAsArray<IDataType[]>({
        endpoint: { ...API_DATA_TYPES_SCHEME.getDataTypes },
        payload,
    })

    return { ...response }
}
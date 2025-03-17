import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IDataType } from '../../../../types/data-types'
import { API_DATA_TYPES_SCHEME } from '../../settings'

export const getDataTypesById = async (
    id: string
): Promise<IApiReturn<IDataType | undefined>> => {
    const url = API_DATA_TYPES_SCHEME.getDataTypesById.url.replace(':id', id)
    const response = await API.apiQuery<IDataType>({
        method: API_DATA_TYPES_SCHEME.getDataTypesById.method,
        url: url,
    })

    return {
        ...response,
    }
}
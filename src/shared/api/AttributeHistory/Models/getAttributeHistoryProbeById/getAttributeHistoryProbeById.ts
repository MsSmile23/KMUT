import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_ATRIBUTE_HISTORY_SCHEME } from '@shared/api/AttributeHistory/settings'
import { IObject } from '@shared/types/objects'

export const getAttributeHistoryProbeById = async (
    id: number
): Promise<IApiReturn<IObject | undefined>> => {
    return API.apiQuery<IObject>({
        method: API_ATRIBUTE_HISTORY_SCHEME.getAttributeHistoryProbeById.method,
        url: API_ATRIBUTE_HISTORY_SCHEME.getAttributeHistoryProbeById.url.replace(':id', String(id)),
    })
}
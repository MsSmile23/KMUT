import { IVoshodRegionStatus, IVoshodRegionStatusesPayload } from '@shared/types/voshod'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_VOSHOD } from '../../settings'

export const postRegionStatuses = async (payload: IVoshodRegionStatusesPayload):
    Promise<IApiReturn<Partial<IVoshodRegionStatus[]> | undefined>> => {


    const response = await API.apiQuery<Partial<IVoshodRegionStatus[]> | undefined>({
        method: API_VOSHOD.postRegionStatuses.method,
        url: API_VOSHOD.postRegionStatuses.url,
        data: payload,
    })


    
    return {
        ...response,
    }
}
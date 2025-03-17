import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'
import { IObjectStateHistory } from '@shared/types/objects';

type TReturnValue = Promise<IApiReturn<IObjectStateHistory | undefined>>

export const getObjectStateHistory = async (id: string | number, period?: any): TReturnValue => {
    const periods = period?.map(p => p ? p?.unix() : null) 

    const urlFilters = `?filter[time_out]=${periods[1]}&filter[time_in]=${periods[0]}`
    const url = API_OBJECTS_SCHEME.getObjectStateHistory.url.replace(':id', String(id))
    const response = await API.apiQuery<IObjectStateHistory>({
        method: API_OBJECTS_SCHEME.getObjectStateHistory.method,
        url: url.concat((period[0] !== null && period[1] !== null) ? urlFilters : '')
    })

    return {
        ...response,
    }
}
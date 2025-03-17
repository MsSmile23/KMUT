import { API, IApiReturn } from '@shared/lib/ApiSPA'

import { IAttributeHistory } from '@shared/types/attribute-history'
import { API_ATRIBUTE_HISTORY_SCHEME } from '@shared/api/AttributeHistory/settings'
import { IObjectAttribute } from '@shared/types/objects';
import { GenericAbortSignal } from 'axios';

const toDecimal = (value: number, order = 2) => {
    const decimalValue = Math.pow(10,  order)

    return Math.round(value * decimalValue) / decimalValue
}

export const getAttributeHistoryById = async ({ id, start, end, signal, limit }: {
    id: IObjectAttribute['id'], 
    start?: string,
    end?: string,
    limit?: number
    signal?: GenericAbortSignal
}): Promise<IApiReturn<IAttributeHistory | undefined>> => {
    const currentPeriod = start && end 
        ? `?start=${start}&end=${end}`
        : ''
    const currentLimit = limit ? `${currentPeriod ? '&' : '?'}limit=${limit}` : ''

    const url = API_ATRIBUTE_HISTORY_SCHEME.getAttributeHistoryById.url.replace(':id', String(id)) + currentPeriod 
        + currentLimit
    
    const response = await API.apiQuery<IAttributeHistory>({
        method: API_ATRIBUTE_HISTORY_SCHEME.getAttributeHistoryById.method,
        url: url,
        extraConfig: {
            signal
        }
    })

    return {
        ...response,
    //     data: {
    //         ...response.data,
    //         series: response.data?.series?.map(serie => ({
    //             ...serie,
    //             data: serie?.data?.map(point => {
    //                 return [
    //                     point[0],
    //                     typeof point[1] == 'string' 
    //                         ? toDecimal(parseFloat(point[1] as string), 2)
    //                         : toDecimal(point[1], 2)
    //                 ]
    //             })
    //         }))
    //     }
    }
}
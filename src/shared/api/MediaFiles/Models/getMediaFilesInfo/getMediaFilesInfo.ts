import { API, IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { TMediaFilesInfoData } from '@shared/types/media-files'

export const getMediaFilesInfo = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<TMediaFilesInfoData[]>> => {
    const response = await API.apiGetAsArray<TMediaFilesInfoData[]>({
        endpoint: {
            method: 'get',
            url: 'mediafiles/info',
        },
        payload,
    })

    return { ...response }
}
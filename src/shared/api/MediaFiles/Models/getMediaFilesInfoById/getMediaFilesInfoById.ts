import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { TMediaFilesInfoData } from '@shared/types/media-files'

type TGetMediaFilesByIdPayload = {
    id: number
}

type TMediaFilesInfo = {
    data: TMediaFilesInfoData
}

export const getMediaFilesInfoById = async (
    payload: TGetMediaFilesByIdPayload
): Promise<IApiReturn<TMediaFilesInfo | undefined>> => {
    return API.apiQuery<TMediaFilesInfo>({
        method: 'get',
        url: `mediafiles/info/${payload.id}`,
    })
}
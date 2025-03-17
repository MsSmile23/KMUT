import { API, IApiReturn } from '@shared/lib/ApiSPA'

type TGetMediaFilesByIdPayload = {
    id: number
}

type TMediaFile = File | Blob;

export const getMediaFilesById = async (
    payload: TGetMediaFilesByIdPayload
): Promise<IApiReturn<TMediaFile | undefined>> => {
    return API.apiQuery<TMediaFile>({
        method: 'get',
        url: `mediafiles/${payload.id}`,
        extraConfig: { responseType: 'blob' }
    })
}
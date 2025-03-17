import { API, IApiReturn } from '@shared/lib/ApiSPA'

type TGetMediaFilesByIdPayload = {
    url: string
}

type TMediaFile = File | Blob;


export const getMediaFileFromStorage = async (
    payload: TGetMediaFilesByIdPayload
): Promise<IApiReturn<TMediaFile | undefined>> => {
    return API.apiQuery<TMediaFile>({
        method: 'get',
        url: import.meta.env.VITE_API_SERVER + `/${payload.url}`,
    })
}
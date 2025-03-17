import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { TMediaFilesInfoData } from '@shared/types/media-files'

type TPostMediaFilesPayload = {
    folder?: string,
    disk?: string,
    files: File[] | Blob[]
}

export const postMediaFiles = async ({
    disk = 'public',
    folder = 'media_files',
    files
}: TPostMediaFilesPayload): Promise<IApiReturn<TMediaFilesInfoData[] | undefined>> => {
    const formData = new FormData();
    
    files.forEach((file) => {
        formData.append('files[]', file)
    })


    return API.apiQuery<TMediaFilesInfoData[]>({
        method: 'post',
        url: `mediafiles/${disk}/${folder}`,
        extraHeaders: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    })
}
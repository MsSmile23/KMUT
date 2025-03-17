import { IFileObjectLicense, ILicense } from '@shared/types/license';
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_LICENSES_SCHEME } from '../../settings';


export const postLicense = async (
    payload: IFileObjectLicense
): Promise<IApiReturn<ILicense | undefined>> => { 

    if ( payload?.file instanceof File && payload?.file !== undefined && 
        payload?.file.size !== 0 || payload?.file.size !== undefined) {
        const formData = new FormData();
        
        formData.append('file', payload.file)
        const response = await API.apiQuery<ILicense>(
            { 
                method: API_LICENSES_SCHEME.postLicense.method,
                url: API_LICENSES_SCHEME.postLicense.url,
                extraHeaders: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            }
        )
        
        return {
            ...response,
        };
    } else {
        return {
            success: false,
            data: null 
        };
    }



}
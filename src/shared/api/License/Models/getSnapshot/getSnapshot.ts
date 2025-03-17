
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_LICENSES_SCHEME } from '../../settings'


export const getSnapshot = async (): Promise<IApiReturn<BlobPart | undefined>> => {     

    const response = await API.apiQuery<BlobPart>(
        { 
            method: API_LICENSES_SCHEME.getSnapshot.method,
            url: API_LICENSES_SCHEME.getSnapshot.url,
            extraConfig: { responseType: 'blob' }
        }
    )

    return {
        ...response
    }
}
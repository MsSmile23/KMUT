import { API_VTEMPLATES_SCHEME } from '../../settings';
import { API, IApiReturn } from '@shared/lib/ApiSPA';

type postVtemplatesPayload = {
    name: string,
    vtemplate_type_id: number,
    mnemonic: string,
    params: string
}

export const postVtemplates = async (
    payload: postVtemplatesPayload
): Promise<IApiReturn<any | undefined>> => {
    const response = await API.apiQuery<any>({
        method: API_VTEMPLATES_SCHEME.postVtemplates.method,
        url: API_VTEMPLATES_SCHEME.postVtemplates.url,
        data: payload,
    })

    return {
        ...response,
    }
}

// export const postVtemplates = async (
//     payload: postVtemplatesPayload
// ): Promise<IApiReturn<postVtemplatesPayload>> => {
//     const endpoint =  { ...API_VTEMPLATES_SCHEME.postVtemplates }
//     const response = await API.apiGetAsArray<any>({
//         endpoint: endpoint,
//         payload,
//     })

//     return { ...response }

// }
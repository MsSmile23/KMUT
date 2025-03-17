import { API_VTEMPLATES_SCHEME } from '../../settings';
import { API, IApiReturn } from '@shared/lib/ApiSPA';
import { IAttribute } from '@shared/types/attributes';


type patchVtemplatesPayload = {
    name: string,
    vtemplate_type_id: number,
    mnemonic: string,
    params: string
}

export const patchVtemplates = async (
    payload: patchVtemplatesPayload,
    id: number,
): Promise<IApiReturn<IAttribute | undefined>> => {
    const url = API_VTEMPLATES_SCHEME.patchVtemplates.url.replace(':id', String(id))
    const response = await API.apiQuery<IAttribute>({
        method: API_VTEMPLATES_SCHEME.patchVtemplates.method,
        url: url,
        data: payload,
    })

    return {
        ...response,
    }
}
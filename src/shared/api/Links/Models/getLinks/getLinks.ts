import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { ILink } from '../../../../types/links'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_LINKS_SCHEME } from '../../settings'


//TODO: Добавить типизацию 
export const getLinks = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<ILink[]>> => {
    const response = await API.apiGetAsArray<ILink[]>({
        endpoint: { ...API_LINKS_SCHEME.getLinks },
        payload,
    })

    return { ...response }
}
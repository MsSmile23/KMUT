import { PAYLOAD_DEFAULT_GET } from '@shared/api/const';
import { API_VTEMPLATES_SCHEME } from '../../settings';
import { API, IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA';
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates';

export const getVtemplates = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET): Promise<IApiReturn<dataVtemplateProps<paramsVtemplate>[]>> => {
    const endpoint = { ...API_VTEMPLATES_SCHEME.getVtemplates }
    const response = await API.apiGetAsArray<dataVtemplateProps<paramsVtemplate>[]>({
        endpoint: endpoint,
        payload,
    })
    
    return { ...response }
}
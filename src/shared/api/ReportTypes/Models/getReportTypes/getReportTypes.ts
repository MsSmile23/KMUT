import { TReportType } from '@shared/types/reports'
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_REPORT_TYPES_SCHEME } from '../../settings'


export const getReportTypes = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<TReportType[]>> => {
    const response = await API.apiGetAsArray<TReportType[]>({
        endpoint: { ...API_REPORT_TYPES_SCHEME.getReportTypes },
        payload,
    })

    return { ...response }
}
import { TReport } from '@shared/types/reports'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_REPORTS_SCHEME } from '../../settings'


export const getReports = async (
    payload: Record<string, string | number | boolean>
): Promise<IApiReturn<TReport[]>> => {
    const response = await API.apiGetAsArray<TReport[]>({
        endpoint: { ...API_REPORTS_SCHEME.getReports },
        payload,
    })

    return { ...response }
}
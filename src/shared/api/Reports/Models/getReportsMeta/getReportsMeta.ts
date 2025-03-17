import { TReport } from '@shared/types/reports'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_REPORTS_SCHEME } from '../../settings'

type TMetaOption = {
    mnemo: string
    label: string
}

type TReportMetaData = {
    allowedFilters: string[]
    allowedSorts: string[]
    attribute_history_options: Record<string, TMetaOption>
    construction_periods: Record<string, TMetaOption>
    frequency: Record<string, TMetaOption>
    frequency_type: Record<string, TMetaOption>
}

export const getReportsMeta = async (
): Promise<IApiReturn<TReportMetaData>> => {
    const response = await API.apiQuery<TReportMetaData>({
        method: API_REPORTS_SCHEME.getReportById.method,
        url: API_REPORTS_SCHEME.getReportsMeta.url,
    })

    return { ...response }
}
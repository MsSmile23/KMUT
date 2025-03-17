import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_REPORT_TYPES_ENDPOINTS = [
    'getReportTypes',
    'getReportTypeById',
    'postReportType',
    'patchReportTypeById',
    'deleteReportTypeById',
] as const

type IEndpoint = (typeof API_REPORT_TYPES_ENDPOINTS)[number]

const url = ENTITY.REPORT_TYPES.API_ROUTE
const idUrl = url + '/:id'

export const API_REPORT_TYPES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getReportTypes: { method: 'GET', url },
    getReportTypeById: { method: 'GET', url: idUrl },
    postReportType: { method: 'POST', url },
    patchReportTypeById: { method: 'PATCH', url: idUrl },
    deleteReportTypeById: { method: 'DELETE', url: idUrl },
}
import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_REPORTS_ENDPOINTS = [
    'getSyslog',
] as const

type IEndpoint = (typeof API_REPORTS_ENDPOINTS)[number]

export const API_SYSLOG_SCHEME: IApiEntityScheme<IEndpoint> = {
    getSyslog: { method: 'GET', url: ENTITY.SYSLOG.API_ROUTE },
}
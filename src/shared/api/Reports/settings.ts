import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_REPORTS_ENDPOINTS = [
    'getReports',
    'getReportById',
    'postReport',
    'patchReportById',
    'downloadReportById',
    'deleteReportById',
    'getReports2',
    'downloadReportById2',
    'getReportById2',
    'deleteReportById2',
    'getReportsMeta',
    'postReportsTasks',
    'getTasks',
    'deleteTaskById',
    'patchTaskById',
] as const

type IEndpoint = (typeof API_REPORTS_ENDPOINTS)[number]

const url = ENTITY.REPORTS.API_ROUTE
const url2 = `${ENTITY.REPORTS.API_ROUTE}/v2`
const tasksUrl = `${ENTITY.REPORTS.API_ROUTE}/v2/tasks`
const tasksUrlId = tasksUrl + '/:id'
const idUrl = url + '/:id'
const idUrl2 = url2 + '/:id'

export const API_REPORTS_SCHEME: IApiEntityScheme<IEndpoint> = {
    getReports: { method: 'GET', url },
    getReportById: { method: 'GET', url: idUrl },
    postReport: { method: 'POST', url },
    patchReportById: { method: 'PATCH', url: idUrl },
    downloadReportById: {
        method: 'POST',
        url: `${ENTITY.REPORTS.API_ROUTE}/:id/download/:format`, 
    },
    deleteReportById: { method: 'DELETE', url: idUrl },
    getReports2: { method: 'GET', url: url2 },
    downloadReportById2: {
        method: 'POST',
        url: `${url2}/:id/download/:format`, 
    },
    getReportById2: { method: 'GET', url: idUrl2 },
    deleteReportById2: { method: 'DELETE', url: idUrl2 },
    getReportsMeta: { method: 'GET', url: `${tasksUrl}/meta` },
    postReportsTasks: { method: 'POST', url: tasksUrl },
    getTasks: { method: 'GET', url: tasksUrl },
    deleteTaskById: { method: 'DELETE', url: tasksUrlId },
    patchTaskById: { method: 'PATCH', url: tasksUrlId },
}
import { IApiEntityScheme } from '../../lib/ApiSPA'
import { ENTITY } from '../../config/entities'

export const API_NETFLOW = [
    'getNetflowSources',
] as const

type IEndpoint = (typeof API_NETFLOW)[number]

export const API_NETFLOW_SCHEME: IApiEntityScheme<IEndpoint> = {
    getNetflowSources: {
        method: 'GET',
        url: ENTITY.NETFLOW.API_ROUTE,
    },
}
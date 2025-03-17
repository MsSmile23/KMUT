import { ENTITY } from '@shared/config/entities'
import { IApiEntityScheme } from '@shared/lib/ApiSPA'

export const API_GROUP_POLICES_ENDPOINTS = [ 
    'getGroupPolicies', 
    'postGroupPolicy', 
    'patchGroupPolicyById', 
    'deleteGroupPolicyById' 
] as const

type IEndpoint = (typeof API_GROUP_POLICES_ENDPOINTS)[number]

const url = ENTITY.GROUP_POLICIES.API_ROUTE
const idUrl = url + '/:id'

export const API_GROUP_POLICES_SCHEME: IApiEntityScheme<IEndpoint> = {
    getGroupPolicies: { method: 'GET', url },
    postGroupPolicy: { method: 'POST', url },
    patchGroupPolicyById: { method: 'PATCH', url: idUrl },
    deleteGroupPolicyById: { method: 'DELETE', url: idUrl },
}
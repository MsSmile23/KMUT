import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_PERMISSIONS_SCHEME } from '../../settings'
import { IPermission, IPermissionsGroup } from '@shared/types/permissions'

export const getPermissions = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IPermissionsGroup[]>> => {
    const response = await API.apiGetAsArray<IPermissionsGroup[]>({
        endpoint: { ...API_PERMISSIONS_SCHEME.getPermissions },
        payload,
    })

    return { ...response }
}
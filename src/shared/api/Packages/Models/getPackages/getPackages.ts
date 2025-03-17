import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'

import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { IPackage } from '../../../../types/packages'
import { API_PACKAGES_SCHEME } from '../../settings'

export const getPackages = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<IPackage[]>> => {
    const response = await API.apiGetAsArray<IPackage[]>({
        endpoint: { ...API_PACKAGES_SCHEME.getPackages },
        payload,
    })

    return { ...response }
}
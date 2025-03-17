import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IPackage } from '../../../../types/packages'
import { API_PACKAGES_SCHEME } from '../../settings'

export const getPackageById = async (
    id: string
): Promise<IApiReturn<IPackage | undefined>> => {
    const url = API_PACKAGES_SCHEME.getPackageById.url.replace(':id', id)
    
    const response = await API.apiQuery<IPackage>({
        method: API_PACKAGES_SCHEME.getPackageById.method,
        url: url,
    })

    return {
        ...response,
    }
}
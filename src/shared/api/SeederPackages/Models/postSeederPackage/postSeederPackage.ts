import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_SEEDER_PACKAGES_SCHEME } from '../../settings'
import { ISeederPackages } from '@shared/types/seeder-packs'

export const postSeederPackage = async (payload: {name: string}):
    Promise<IApiReturn<Partial<ISeederPackages> | undefined>> => {
    const response = await API.apiQuery<Partial<ISeederPackages> | undefined>({
        method: API_SEEDER_PACKAGES_SCHEME.postSeederPackage.method,
        url: API_SEEDER_PACKAGES_SCHEME.postSeederPackage.url,
        data: payload,
    })

    return {
        ...response,
    }
}
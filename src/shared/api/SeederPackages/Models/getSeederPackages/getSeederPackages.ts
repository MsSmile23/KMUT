import { ISeederPackages } from '@shared/types/seeder-packs'
import { API, IApiGetPayload, IApiReturn } from '../../../../lib/ApiSPA'
import { PAYLOAD_DEFAULT_GET } from '../../../const'
import { API_SEEDER_PACKAGES_SCHEME } from '../../settings'

export const getSeederPackages = async (
    payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
): Promise<IApiReturn<ISeederPackages[]>> => {
    const response = await API.apiGetAsArray<ISeederPackages[]>({
        endpoint: { ...API_SEEDER_PACKAGES_SCHEME.getSeederPacks },
        payload,
    })

    return { ...response }
}
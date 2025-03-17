import { ILicense } from '@shared/types/license'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_LICENSES_SCHEME } from '../../settings'
import { useConfigStore } from '@shared/stores/config'
import { jsonParseAsObject } from '@shared/utils/common'

export const getLicense = async (): Promise<IApiReturn<ILicense | undefined>> => { 
    
    const response = await API.apiQuery<ILicense>(
        { 
            method: API_LICENSES_SCHEME.getLicense.method,
            url: API_LICENSES_SCHEME.getLicense.url
        }
    )
    const getConfig = useConfigStore.getState().getConfigByMnemo
    const config = jsonParseAsObject(getConfig('front_settings')?.value)

    if (config?.licenseStatus === true) {
        return {
            ...response
        } 
        
    } else {
        return {
            code: 200,
            codeMessage: 'Успешно',
            data: {
                main: {
                    sn: 'some-people',
                    from: '2023-12-01',
                    till: '2124-10-20',
                    valid: false, 
                },
                limits: {
                    classes: 999999,
                    attributes: 999999,
                    objects: 999999,
                    users: 999999,
                    vtemplates: 999999
                },
                current: {
                    classes: 1000,
                    attributes: 1200,
                    objects: 1400,
                    users: 7,
                    vtemplates: 1001
                }
            },
            success: true
        }
    } 
}
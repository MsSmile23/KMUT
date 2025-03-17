import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_OBJECTS_REGISTRATION_SCHEME } from '../../settings'
import { objectsRegistration } from '@shared/types/objects-registrations'

export const getObjectsRegistration = async (): Promise<IApiReturn<objectsRegistration | undefined>> => {     

    const response = await API.apiQuery<objectsRegistration>(
        { 
            method: API_OBJECTS_REGISTRATION_SCHEME.getObjectsRegistration.method,
            url: API_OBJECTS_REGISTRATION_SCHEME.getObjectsRegistration.url
        }
    )

    return {
        ...response,
    }
}
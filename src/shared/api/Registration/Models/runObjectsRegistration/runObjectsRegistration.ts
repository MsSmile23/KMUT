import { objectsRegistration } from '@shared/types/objects-registrations'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_OBJECTS_REGISTRATION_SCHEME } from '../../settings'


export const runObjectsRegistration = async (): Promise<IApiReturn<objectsRegistration | undefined>> => {     

    const response = await API.apiQuery<objectsRegistration>(
        { 
            method: API_OBJECTS_REGISTRATION_SCHEME.runObjectsRegistration.method,
            url: API_OBJECTS_REGISTRATION_SCHEME.runObjectsRegistration.url
        }
    )

    return {
        ...response,
    }
}
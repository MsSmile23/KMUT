import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { API_OBJECTS_REGISTRATION_SCHEME } from '../../settings'


export const getObjectsRegistrationReport = async (): Promise<IApiReturn<Response | undefined>> => {     

    const response = await API.apiQuery<Response>(
        { 
            method: API_OBJECTS_REGISTRATION_SCHEME.getObjectsRegistrationReport.method,
            url: API_OBJECTS_REGISTRATION_SCHEME.getObjectsRegistrationReport.url
        }
    )

    return {
        ...response,
    }
}
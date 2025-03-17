import { IApiEntityScheme } from '../../lib/ApiSPA'

export const API_REGISTRATION_ENDPOINTS = [
    'getObjectsRegistration',
    'getObjectsRegistrationReport',
    'runObjectsRegistration',
] as const

type IEndpoint = (typeof API_REGISTRATION_ENDPOINTS)[number]

export const API_OBJECTS_REGISTRATION_SCHEME: IApiEntityScheme<IEndpoint> = {
    getObjectsRegistration: {
        method: 'GET',
        url: 'public/objects/registration',
    },
    getObjectsRegistrationReport: {
        method: 'GET',
        url: 'public/objects/registration/report',
    },
    runObjectsRegistration: {
        method: 'PUT',
        url: 'public/objects/registration/run',
    },
}
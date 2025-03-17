import { apiQuery } from './apiRequests/apiQuery'
import { apiGetAsArray } from './apiRequests/apiGetAsArray'
import axios from './axios/axios'
import { apiGetAsId } from './apiRequests/apiGetAsId'

export const libConfig = {
    replacePatchToPost: true,
    replacePutToPost: true,
}

export const API = {
    apiQuery,
    apiGetAsArray,
    apiGetAsId
}

export * from './types'

export { axios }
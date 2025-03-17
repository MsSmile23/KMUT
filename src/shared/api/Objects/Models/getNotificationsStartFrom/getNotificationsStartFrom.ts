import { IObjectNotification } from '@shared/types/objects'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'

export const getNotificationsStartFrom = async (id: string | number): Promise<
    IApiReturn<IObjectNotification[] | undefined>
> => {
    const url = API_OBJECTS_SCHEME.getNotificationsStartFrom.url.replace('nid', `${id}`)

    return API.apiQuery<IObjectNotification[]>({
        method: API_OBJECTS_SCHEME.getNotificationsStartFrom.method,
        url,
    })
}
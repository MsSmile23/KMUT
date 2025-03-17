import { IObjectNotification } from '@shared/types/objects'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_OBJECTS_SCHEME } from '../../settings'

type TReturn = Promise<IApiReturn<IObjectNotification[] | undefined>> 

export const getNotifications = async ({
    unread, 
    last_message_id
}: {
    unread?: boolean
    last_message_id?: string
} = {}): TReturn => {
    const params = [];
    const id = Number(last_message_id)

    //Если есть last_message_id то получаем по нему
    if (id) {
        params.push('last_message_id=' + id)
    //Если есть unread и нет last_message_id то получаем новые
    } else if (unread) {
        params.push('new=true')
    }
    //Если ни одно условие не сработает, то получим все

    const url = { ...API_OBJECTS_SCHEME.getNotifications }.url + (params.length > 0 ? '?' + params.join('&') : '')

    return API.apiQuery<IObjectNotification[]>({
        method: API_OBJECTS_SCHEME.getNotifications.method,
        //url: API_OBJECTS_SCHEME.getNotifications.url + (unread ? '?new=true' : ''),
        url
    })
}
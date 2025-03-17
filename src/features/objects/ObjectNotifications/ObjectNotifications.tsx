import { useCallback, useEffect, useRef } from 'react';
import { Button, Space, notification } from 'antd';
import { getNotifications } from '@shared/api/Objects/Models/getNotifications/getNotifications';
import { generalStore, selectLastNotifications } from '@shared/stores/general';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { useLocation } from 'react-router-dom';
import { getURL } from '@shared/utils/nav';

export const ObjectNotifications = () => {
    const [api, contextHolder] = notification.useNotification({ stack: { threshold: 3 } });
    const notifier = generalStore(selectLastNotifications)
    const location = useLocation()
    const notificationsRoute = getURL(`${ROUTES.NOTIFICATIONS}/${ROUTES_COMMON.LIST}`, 'showcase')
    // const notificationsRoute = `/${ROUTES.NOTIFICATIONS}/${ROUTES_COMMON.LIST}`

    const request = useCallback( async () => {
        const lastId = localStorage.getItem('last-notification-id')
        const response = await getNotifications({ unread: true, last_message_id: lastId })

        if (response.data && response.success) {
            const newLastId = response.data[response.data.length - 1]?.id
            
            if (newLastId) {
                localStorage.setItem('last-notification-id', `${newLastId}`)
            }
            
            const lastTenNotifications = response.data.slice(-10)

            notifier.setLastNotifications([
                // ...notifier.lastNotifications,
                ...response.data.map((notify) => {
                    return {
                        ...notify,
                        unread: location.pathname === notificationsRoute 
                            ? false
                            : true,
                    }
                })
            ])

            

            if (location.pathname !== notificationsRoute) {
                lastTenNotifications.forEach((notify) => {
                // response.data.forEach((notify) => {
                    const message = notify.object_attributes.find((oa) => {
                        return oa.attribute_id === 305
                    })?.attribute_value

                    const description = notify.object_attributes.find((oa) => {
                        return oa.attribute_id === 301
                    })?.attribute_value

                    api.open({
                        message: message || 'Отсутствует сообщение',
                        description: description || 'Отсутствует описание',
                        duration: null,
                        key: notify.id,
                        btn: (
                            <Space>
                                <Button type="default" size="small" onClick={() => api.destroy()}>
                                    Закрыть все
                                </Button>
                                <Button type="primary" size="small" onClick={() => api.destroy(notify.id)}>
                                    OK
                                </Button>
                            </Space>
                        )
                    });
                })
            }
        } 
    }, [api])

    const id = useRef<any>()

    useEffect(() => {
        if (location.pathname === notificationsRoute) {
            notifier.setLastNotifications(notifier.lastNotifications.map(it => {
                return {
                    ...it,
                    unread: false
                }
            }))
            api.destroy()
        }
    }, [location.pathname])

    useEffect(() => {
        request()

        id.current = setInterval(request, 65_000)

        return () => clearInterval(id.current)
    }, [])

    return contextHolder
};
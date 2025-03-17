import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons'
import { useHealthStore } from '@shared/stores/health/healthStore'
import { useCombineStores } from '@shared/stores/utils/useCombineStore'
import { StoreStates } from '@shared/types/storeStates'
import { Modal } from 'antd'
import { NotificationInstance } from 'antd/es/notification/interface'
import useNotification from 'antd/es/notification/useNotification'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useTheme } from './useTheme'

const blockingMessage = 'Интерфейс заблокирован. Пытаемся восстановить связь, не перезагружайте страницу.'
const accessMessage = 'Сервер снова доступен. Синхронизируем данные. Интерфейс разблокирован.'

const colors = {
    info: 'rgb(0, 120, 200)',
    warning: 'rgb(220, 140, 0)',
    error: 'rgb(150, 0, 0)',
    success: 'rgb(0, 150, 0)',
}

const icons = {
    info: <InfoCircleFilled style={{ color: 'white' }} />,
    warning: <WarningFilled style={{ color: 'white' }} />,
    error: <CloseCircleFilled style={{ color: 'white' }} />,
    success: <CheckCircleFilled style={{ color: 'white' }} />
}

const translated = {}

/**
 * Хук для отправки запросов на сервер и установки таймеров (CheckHealth).
 * 
 * При блокировке интерфейса останавливает загрузку сторов. При разблокировке запускает ее заново.
 * 
 * @returns 
 */
export const useHealth = () => {
    const health = useHealthStore()
    const combinedStores = useCombineStores()
    const stores = Object.values(combinedStores)
    const theme = useTheme()

    const healthTimer = useRef<{ polling?: any, initial?: any }>({
        polling: null, // таймер для постоянных запросов после загрузки сторов и прелоада
        initial: null, // таймер для запросов перед появлением прелоада
    })

    // проверка первого запроса до загрузки прелоада
    const [healthInitialChecked, setHealthInitialChecked] = useState(false)
    const [healthInitialTimer, setHealthInitialTimer] = useState(2)
    const [notificationApi, notificationContext] = useNotification({ top: 75 });

    // todo: удалить lastCheckItems и isError? проверка на блокировку в данный момент осуществляется через стор
    const lastCheckItems = useMemo(() => [...health.data].reverse().filter((_, i) => i < 3), [health.data])
    const isError = useMemo(() => {
        return lastCheckItems.length > 2 && lastCheckItems.every((item) => !item?.status || Number(item?.status) !== 1)
    }, [lastCheckItems])

    const destroyAll = useCallback(() => {
        notificationApi.destroy('net-warn')
        notificationApi.destroy('net-error')
        notificationApi.destroy('net-success')
    }, [notificationApi])

    /**
     * Вызов (отображение компонентов) уведомлений для различных статусов
     */
    const callNotification = useCallback((mnemo: keyof NotificationInstance, config: any) => {
        const styles = { color: 'white' }

        setTimeout(() => notificationApi.open({
            ...config,
            duration: 0,
            message: <b style={styles}>{config?.message || ''}</b>,
            description: <span style={styles}>{config?.description || ''}</span>,
            icon: icons?.[mnemo] || icons.info,
            closeIcon: null,
            style: {
                background: colors?.[mnemo] || colors.info,
                borderRadius: 8,
            }
        }))
    }, [notificationApi])

    /**
     * Проверяет состояние сервера при первом запуске приложения (до прелоада)
     */
    const handleInitialRequest = useCallback(() => {
        health.request().then((response) => {
            if (response?.success && response?.data?.status == 1) {
                Modal.destroyAll()

                setHealthInitialChecked(true)
            } else {
                setTimeout(() => {
                    handleInitialRequest()
                }, 3000)
            }
        })
    }, [])

    // самый первый запрос перед включением сторов
    // счетчик секунд до появления модального окна проверки подключения
    useEffect(() => {
        handleInitialRequest()

        healthTimer.current.initial = setInterval(() => {
            setHealthInitialTimer((time) => time - 1)
        }, 1000)

        return () => {
            clearInterval(healthTimer.current.initial)
        }
    }, [])

    // вызов модального окна проверки подключения
    useEffect(() => {
        if (healthInitialTimer === 0 && theme?.checkHealthBlocking) {
            clearInterval(healthTimer.current.initial)

            Modal.destroyAll()

            Modal.info({
                title: 'Проверка доступности сервера',
                content: '', //health?.data?.message,
                centered: true,
                footer: null,
                width: 'max-content'
            })
        }
    }, [healthInitialTimer])

    // установка запросов проверки сервера
    useEffect(() => {
        if (healthInitialChecked) {
            clearInterval(healthTimer.current.initial)

            Modal.destroyAll()

            healthTimer.current.polling = setInterval(async () => {
                await health.request()
            }, 10_000)
        }

        return () => {
            clearInterval(healthTimer.current.polling)
        }
    }, [healthInitialChecked])

    const message = health.lastItemMessage

    // вызов компонентов уведомлений на основе статусов
    useEffect(() => {

        if (!theme?.checkHealthBlocking) {
            destroyAll()

            return
        }

        if (health.status === 'ok') {
            destroyAll()
        }

        if (health.status === 'warn') {
            const description = message === 'Server is working'
                ? accessMessage
                : (translated[message] || 'Сеть недоступна')

            callNotification('warning', {
                description,
                message: 'Потеря связи',
                key: 'net-warn',
            })
        }

        if (health.status === 'error') {
            notificationApi.destroy('net-warn')

            const description = message === 'Server not working'
                ? 'Сервер недоступен'
                : (translated[message] || 'Сеть недоступна')

            callNotification('error', {
                // todo: удалить из хука jsx (вынести модалку в отдельный компонент или изменить через классы)
                message: 'Проблема с сетью',
                description: `${blockingMessage} ${description}.`,
                key: 'net-error',
            })

            Object.values(stores).forEach((store) => {
                store.setStopApiUpdateLoop()
            })
        }

        if (health.status === 'success') {
            notificationApi.destroy('net-error')

            callNotification('success', {
                // todo: удалить из хука jsx (вынести модалку в отдельный компонент или изменить через классы)
                message: 'Связь восстановлена',
                description: accessMessage,
                key: 'net-success',
            })
        }
    }, [health.status, message])

    // включение сторов после блокировки интерфейса (статус error)
    useEffect(() => {
        if (health.status === 'success') {
            const activeStores = Object.values(stores)
                .filter((s) => s.store.state !== StoreStates.NONE)
                .filter((s) => s.params.updateLoop === null)

            const fetchedData = Promise.all(activeStores.map((store) => store.fetchData()))

            fetchedData.then(() => activeStores.forEach((s) => s.setStartApiUpdateLoop()))
        }
    }, [health.status])

    return {
        isError,
        notificationContext,
        initialized: healthInitialChecked,
        store: health
    } as const
}
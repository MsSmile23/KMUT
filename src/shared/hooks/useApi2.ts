import { IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'
import { useHealthStore } from '@shared/stores/health/healthStore'
import { message } from 'antd'
import { useState, useEffect, useRef, useCallback } from 'react'

type TRequest<T, P> = (payload?: P) => Promise<IApiReturn<T>>
type TRequestCall = () => void
type TMessages = Partial<{
    success: string
    errorData: string
    errorRequest: string
}>
type TOptions<T, P> = {
    state: Partial<T> // Ответ с данными
    requestOnInit: boolean // deprecated
    onmount: 'item' | boolean | TRequestCall
    payload: Parameters<TRequest<T, P>>[number]
    debugRequest: () => void
    messages?: TMessages
    autoUpdate?: number
    disableAllTrue?: boolean
}

export interface IPaginationMeta {
    currentPage: number
    from: number
    lastPage: number
    perPage: number
    to: number
    total: number
}

/**
 * Общий хук для запросов. 
 * Может принимать функции только с одним аргументом. 
 * Ответ типизируется автоматически, если типизирована передаваемая функция.
 * 
 * @example
 * const rows = useApi2(getRows)
 * const customRows = useApi2<TCustomRow[]>(() => getRows({ all: true }))
 * 
 * @param apiCall - функция запроса
 * @param options - настройки поведения хука
 * @param options.state - начальное состояние внутреннего стора
 * @param options.onmount - отключение запроса при монтировании компонента (по умолчанию включен)
 * @param options.payload - опция для создания тела запроса, если apiCall передан в качестве объекта   
 * @param options.debugRequest - дополнительный запрос, вызываемый перед каждым запросом apiCall
 * @param options.messages - включение уведомлений при неудачных запросах apiCall (todo: удалить?)  
 * @param options.autoUpdate - таймер автообновления, включает автообновление (по умолчанию выключен) 
 * @param options.disableAllTrue - отключение отправки all: true, если не указан другой payload    
 *        
 * @returns data: массив или объект с данными 
 * @returns pagination: данные для пагинации при наличии meta в ответе
 * @returns loading: активен ли запрос или нет
 * @returns empty: если данные в ответе или нет
 * @returns error: сообщение от ошибке
 * @returns request: функция запроса для повторного использования
 * @returns update: функция обновления data
 * @returns options: настройки поведения хука
 * @returns response: нативный ответ запроса
 */
export const useApi2 = <T, P = IApiGetPayload>(
    apiCall: TRequest<T, P>, 
    options?: Partial<TOptions<T, P>>
) => {
    const messages = options?.messages ?? { 
        success: options?.messages?.success, 
        errorData: options?.messages?.errorData,
        errorRequest: options?.messages?.errorRequest
    }

    let state = options?.state ?? [] as any
    let requestOnMount =  options?.onmount ?? true

    if (options?.onmount === 'item') {
        state = {}
        requestOnMount = false
    }

    const [ data, setData ] = useState<Partial<T>>(state)
    const [ pagination, setPagination ] = useState<Partial<IPaginationMeta>>({})
    const [ loading, setLoading ] = useState(Boolean(requestOnMount))
    const [ error, setError ] = useState('')
    const [ response, setResponse ] = useState<IApiReturn<T>>()

    const isNetworkError = useHealthStore((st) => st.status === 'error')

    const request = useCallback(async (payload = options?.payload): Promise<IApiReturn<T>> => {
        // предотвращение запросов при плохом check-health
        if (isNetworkError) {
            setError('Network Error')

            return
        }

        const params: any = payload || ({ all: true })

        if (options?.disableAllTrue && params?.all) {
            delete params.all
        }

        options?.debugRequest?.()

        setError('')
        setLoading(true)

        try {
            const response = await apiCall(params)

            setResponse(response)

            if (!response.success) {
                const errorText = messages?.errorRequest ||  'Ошибка выполнения запроса'

                setError(errorText)

                if (options?.messages && messages) {
                    message.error(errorText)
                }
            }

            if (response.data) {
                setData(response.data)

                const meta = response?.meta

                setPagination({
                    currentPage: meta?.current_page || 0,
                    lastPage: meta?.last_page || 0,
                    perPage: meta?.per_page || 0,
                    to: meta?.to || 0,
                    total: meta?.total || 0,
                    from: meta?.from || 0
                })

                if (options?.messages && messages?.success) {
                    message.success(messages?.success)
                }
            } else {
                const errorText = messages?.errorData ||  'Полученные данные не определены'

                setError(errorText)

                if (options?.messages && messages) {
                    message.error(errorText)
                }
            }

            return response
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)

                return
            }
        } finally {
            setLoading(false)
        }
    }, [isNetworkError])

    useEffect(() => {
        setError('')

        if (requestOnMount && typeof requestOnMount !== 'string') {
            if (isNetworkError) {
                setError('Network Error')

                return
            }

            if (typeof requestOnMount === 'function') {
                requestOnMount()
            } else {
                request().then(setResponse)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestOnMount, isNetworkError])

    const autoUpdateId = useRef<any>(0)

    useEffect(() => {
        if (isNetworkError) {
            clearInterval(autoUpdateId.current)

            return
        }

        if (options?.autoUpdate) {
            autoUpdateId.current = setInterval(() => {
                request?.()
            }, options?.autoUpdate)
        }

        return () => {
            clearInterval(autoUpdateId.current)
        }
    }, [options?.autoUpdate, isNetworkError])

    const empty = Array.isArray(data) 
        ? data.length === 0 
        : Object.keys(data || {}).length === 0

    return {
        data,
        pagination,
        loading,
        empty,
        error,
        request,
        update: setData,
        options,
        response,
        //msg,
        //ctx
    } as const
}
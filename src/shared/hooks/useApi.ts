import { IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'
import { useState, useEffect } from 'react'

export const useApi = <T, P = IApiGetPayload>(
    initialState: Partial<T>, 
    apiCall: (payload?: IApiGetPayload) => Promise<IApiReturn<T>>,
    payload?: P extends any ? any : IApiGetPayload
) => {
    const [ data, setData ] = useState<Partial<T>>(initialState)
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState('')

    const request = (payload?: IApiGetPayload): void => {
        setLoading(true)

        apiCall(payload).then((response) => {
            if (!response.success) {
                throw new Error('Ошибка при получении данных')
            }

            if (response.data) {
                setData(response.data)
            } else {
                throw new Error('Данные запроса неопределенны')
            }
        })
            .catch((err) => {
                if (err instanceof Error) {
                    setError(err.message)
                }
            })
            .finally(() => setLoading(false))
    }


    useEffect(() => {
        request(payload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const empty = Array.isArray(data) 
        ? data.length === 0 
        : Object.keys(data).length === 0

    return {
        data,
        loading,
        empty,
        error,
        request,
        update: setData,
    } as const
}
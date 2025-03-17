import { useRef, useEffect } from 'react'

type TUseAutoUpdate = (
    callback: (...args: any) => void, 
    timer: number, 
    dependency: any
) => void

/**
 * 
 * @param dependency - зависимость, на основе которой будет выполнять функция
 * @param callback - функция для выполнения
 * @param timer - время автообновления в миллисекундах
 */
export const useAutoUpdate: TUseAutoUpdate = (callback, timer, dependency) => {
    const timerId = useRef<any>()

    useEffect(() => {
        if (dependency) {
            timerId.current = setInterval(() => {
                callback()
            }, timer)

            return () => {
                clearInterval(timerId.current)
            }
        } else {
            clearInterval(timerId.current)  
        }
    }, [dependency])
}
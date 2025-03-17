import { useEffect } from 'react'

export const useDebugMountUnmount = (name: string) => {
    useEffect(() => {
        console.log('mount of ' + name)

        return () => {
            console.log('UNmount of ' + name)
        }
    }, [])
}
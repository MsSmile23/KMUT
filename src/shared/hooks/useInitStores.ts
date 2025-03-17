import { useEffect } from 'react'
import { useStores } from './useStores'

export const useInitStores = () => {
    const stores = useStores()

    useEffect(() => {
        Object.values(stores)
            .filter((store) => (store as any)?.loadOnStart)
            .forEach((store) => (store as any)?.init?.())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return stores
}
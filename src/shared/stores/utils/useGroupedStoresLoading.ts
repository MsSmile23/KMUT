import { StoreStates } from '@shared/types/storeStates'
import { useEffect, useState } from 'react'
import { generalStore } from '../general'
import { useCombineStores } from './useCombineStore'
import { useHealthStore } from '../health/healthStore'

export const useGroupedStoresLoading = () => {
    const stores = useCombineStores()
    const health = useHealthStore()
    const setEndPreload = generalStore((state) => state.setEndPreload)

    type IStore = Record<string, (typeof stores[keyof typeof stores] & { name: string })[]> 

    const storesByLoadOrder: IStore = Object.entries(stores).reduce((acc, [name, store]) => {
        acc[store.params.loadOrder] 
            ? acc[store.params.loadOrder].push({
                ...store,
                name
            })
            : acc[store.params.loadOrder] = [{
                ...store,
                name
            }]
        
        return acc
    }, {})


    const initialState =  Object.keys(storesByLoadOrder).map((order) => ({
        order: Number(order),
        loading: false,
        isLoaded: false
    }))

    const [storeLoadingState, setStoreLoadingState] = useState(initialState)
    
    useEffect(() => {
        if (health.isError) {
            setStoreLoadingState(initialState)
        }
    }, [health.isError])
    
    useEffect(() => {
        const groupFinishIdx = storeLoadingState.findIndex(store => !store.isLoaded)

        if (groupFinishIdx < 0) {
            Object.values(stores).forEach(store => {
                store.setStartApiUpdateLoop()
            })

            setEndPreload(true)
        } else {
            if (!storeLoadingState[groupFinishIdx].loading && 
                !storeLoadingState[groupFinishIdx].isLoaded &&
                !health.isError
            ) {
                setStoreLoadingState(state => {
                    state[groupFinishIdx].loading = true

                    return state
                })

                storesByLoadOrder[storeLoadingState[groupFinishIdx].order].map(store => {
                    store.fetchData()
                })
            } 

            const currentStoreGroupOrder = storeLoadingState[groupFinishIdx].order

            const storeStateGroup = storesByLoadOrder[currentStoreGroupOrder]
                .map(store => {


                    if (store?.store?.error?.message === 'User does not have the right permissions.') {
                        return StoreStates.FINISH
                    }
                    
                    return store.store.state
                })

            // Временно включена настройка, что при 403 статусе (в сторе) пропускает загрузку данных
            // const isLoadGroup = storeStateGroup
            //     .every(state => [StoreStates.FINISH, StoreStates.ERROR].includes(state))
                
            const isLoadGroup = storeStateGroup //Это без игнорирования 403
                .every(state => state === StoreStates.FINISH)
 
            if (isLoadGroup) {
                setStoreLoadingState(state => {
                    // state[groupFinishIdx].isLoaded = true
                    // state[groupFinishIdx].loading = false

                    const newState = state.map((st, idx) => {
                        return idx === groupFinishIdx 
                            ? {
                                ...st,
                                loading: false,
                                isLoaded: true
                            }
                            : st
                    })

                    return newState
                })

            }
        }
    }, [
        storeLoadingState.map(state => state.isLoaded + '-' + state.loading).join('/'),
        ...Object.values(stores).map(store => store.store.state),
        health.isError
    ])
}
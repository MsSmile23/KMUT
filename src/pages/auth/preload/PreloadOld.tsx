import { generalStore } from '@shared/stores/general'
import { useTempStores } from '@shared/stores/utils/useTempStores'
import { StoreStates } from '@shared/types/storeStates'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { useEffect, useState } from 'react'

export const PreloadOld = () => {
    const [storesAreLoaded, setStoreAreLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [endPreload, setEndPreload] = generalStore((state) => [
        state.endPreload,
        state.setEndPreload
    ])

    const { stores, startLoopUpdate, getStoreStates } = useTempStores()

    useEffect(() => {
        if (!endPreload && !storesAreLoaded) {
            startLoopUpdate()
            setLoading(true)
        }
    }, [])

    useEffect(() => {
        if (loading) {
            const storeStates = getStoreStates()
            /* const storeStates = Object.entries(stores).map(([storeName, store]) => {
                const currState = {
                    name: storeName,
                    state: store.store.state
                }

                return currState
            }) */

            if (storeStates.every(store => store.state === StoreStates.FINISH)) {
                setStoreAreLoaded(true)
                setLoading(false)
            }
        }
    }, [
        loading,
        // ...storeStates,
        stores.objects.store.state,
        stores.stateEntities.store.state,
        stores.states.store.state,
        stores.classes.store.state,
        stores.relations.store.state,
        stores.links.store.state,
        stores.attributes.store.state,
        stores.dataTypes.store.state,
        stores.stateStereotypes.store.state
    ])

    useEffect(() => {
        if (storesAreLoaded) {
            setEndPreload(true)
        } else {
            setEndPreload(false)
        }
    }, [storesAreLoaded])


    return (
        <div
            style={{ 
                position: 'absolute', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 20, 
                left: 'calc(50% - 130px)', 
                top: '50%' 
            }}
        >
            <CustomPreloader size="default" />
            Загружаем данные приложения...
        </div>
    )
}
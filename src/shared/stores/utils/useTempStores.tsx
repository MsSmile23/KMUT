import { selectClassesUpdateParams, useClassesStore } from '@shared/stores/classes'
import { selectLinksUpdateParams, useLinksStore } from '@shared/stores/links'
import { selectObjectsUpdateParams, useObjectsStore } from '@shared/stores/objects'
import { useRelationsStore, selectRelationsUpdateParams } from '@shared/stores/relations'
import { useStateEntitiesStore, selectStateEntitiesUpdateParams } from '@shared/stores/state-entities'
import { useStatesStore, selectStatesUpdateParams } from '@shared/stores/states'
import { selectAttributesUpdateParams, useAttributesStore } from '@shared/stores/attributes'
import { useStateStereotypesStore, selectStateStereotypesUpdateParams } from '../statesStereotypes'
import { selectDataTypesUpdateParams, useDataTypes } from '../dataTypes'
import { selectConfig, selectConfigUpdateParams, useConfigStore } from '../config'

export const useTempStores = () => {
    const stores = {
        objects: useObjectsStore(selectObjectsUpdateParams),
        classes: useClassesStore(selectClassesUpdateParams),
        states: useStatesStore(selectStatesUpdateParams),
        stateEntities: useStateEntitiesStore(selectStateEntitiesUpdateParams),
        relations: useRelationsStore(selectRelationsUpdateParams),
        // links: useLinksStore(selectLinksUpdateParams),
        attributes: useAttributesStore(selectAttributesUpdateParams),
        stateStereotypes: useStateStereotypesStore(selectStateStereotypesUpdateParams),
        dataTypes: useDataTypes(selectDataTypesUpdateParams),
        config: useConfigStore(selectConfigUpdateParams)
    }


    const startLoopUpdate = () => {
        Object.keys(stores).map(store => {
            stores[store].fetchData()
            stores[store].setStartApiUpdateLoop()
        })
    }

    const stopLoopUpdate = () => {
        Object.values(stores).map((store) => {
            if (store.params.updateLoop) {
                store.setStopApiUpdateLoop()
                store.setInitialStoreState()
            }
        })
    }

    const getStoreStates = () => {
        const storeStates = Object.entries(stores).map(([storeName, store]) => {
            const currState = {
                name: storeName,
                state: store.store.state
            }

            return currState
        })

        return storeStates
    }

    return {
        stores,
        startLoopUpdate,
        stopLoopUpdate,
        getStoreStates
    }
}
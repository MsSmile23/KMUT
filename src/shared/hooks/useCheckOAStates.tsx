import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useStatesStore } from '@shared/stores/states'
import { useMemo } from 'react'

export const useCheckOAStates = ({
    objectAttributeIds,
    currentObjectIds
}: {
    currentObjectIds: number[]
    objectAttributeIds: number[]
}) => {
    const getStateById = useStatesStore(st => st.getStateById)
    const objStoreStates = useStateEntitiesStore(st => st.store.data.objects)
        .filter(it => currentObjectIds?.includes(it.entity))
    const oaStoreStates = useStateEntitiesStore(st => st.store.data.object_attributes)
        .filter(it => objectAttributeIds.includes(it.entity))
    
    const objStates = useMemo(() => {
        return objStoreStates.map(objStateItem => {
            const objState = getStateById(Number(objStateItem.state))

            return {
                objId: objStateItem.entity,
                stateId: objStateItem.state,
                stereoId: objState?.state_stereotype_id ?? 0
            }
        })
    }, [
        currentObjectIds?.join('.'),
        objStoreStates.map(it => `${it.entity}-${it.state}`).join('.')
    ])

    const oaStates = useMemo(() => {
        return oaStoreStates.map(oaStateItem => {
            const oaState = getStateById(Number(oaStateItem.state))

            return {
                oaId: oaStateItem.entity,
                stateId: oaStateItem.state,
                stereoId: oaState?.state_stereotype_id ?? 0
            }
        })
    }, [
        objectAttributeIds.join('.'),
        oaStoreStates.map(it => `${it.entity}-${it.state}`).join('.')
    ])
    
    return {
        oaStates,
        objStates
    }
}
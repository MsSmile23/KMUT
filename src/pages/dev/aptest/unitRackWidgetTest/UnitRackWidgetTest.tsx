import { UnitRackWidget } from '@containers/objects/UnitRackWidget/UnitRackWidget'
import { objectsStore } from '@shared/stores/objects'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useStatesStore } from '@shared/stores/states'
import { FC, useEffect } from 'react'

export const UnitRackWidgetTest: FC = () => {
    const objectStore = objectsStore()
    const entities = useStateEntitiesStore()
    const states = useStatesStore()
    const object = objectStore.getObjectById(10061)

    useEffect(() => {
        objectStore.fetchData()
        entities.fetchData()
        states.fetchData()
    }, [])

    return (
        <UnitRackWidget 
            unit={{ orderAttributeId: 10017, rackRelationId: 10007 }}
            deviceUnit={{ relationId: 10008, sizeAttributeId: 10019 }} 
            object={object}
        />
    )
}
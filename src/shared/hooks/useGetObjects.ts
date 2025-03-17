import { selectObjectAttributes, useObjectAttributesStore } from '@shared/stores/objectAttributes/useObjectAttributesStore'
import { selectObject, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { useEffect, useState } from 'react'

export const useGetObjects = () => {
    const objectsStore = useObjectsStore(selectObjects)
    const getObjById = useObjectsStore(selectObject)

    const objectAttrsStore = useObjectAttributesStore(selectObjectAttributes)

    const [objects, setObjects] = useState(objectsStore.map(obj => {
        return getObjById(obj.id)
    }))

    useEffect(() => {
        setObjects(objectsStore.map(obj => {
            
            return getObjById(obj.id)
        }))
    }, [objectsStore, objectAttrsStore])

    return objects
}
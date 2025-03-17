import { findChildsByBaseClasses } from '@shared/utils/classes'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { useObjectsStore, selectObjects, selectObject } from '@shared/stores/objects'
import { WidgetObjectsInOutHistoryFormProps } from './WidgetObjectsInOutHistoryForm'
import { useGetObjects } from '@shared/hooks/useGetObjects'

export const useGetChildrenObjectIds = (props: WidgetObjectsInOutHistoryFormProps) => {
    const { objectIdFromPath, target, linking } = props

    // Получаем объекты и релейшены из сторов
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const relations = useRelationsStore(selectRelations)

    //  А также метод получения конкретного объекта
    const getObject = useObjectsStore(selectObject)

    // При наличии айди получаем все соответствующие таргет классам
    // дочерние объекты конкретного объекта и фильтруем их по связующим классам
    if (objectIdFromPath) {
        const object = getObject(objectIdFromPath)
    
        // Получаем дочерние классы
        const childClassIds = findChildsByBaseClasses({
            relations,
            classIds: [object?.class_id],
            package_area: 'SUBJECT',
        }) as number[]
    
        // Получаем дочерние объекты
        const childrenObjectsOfTrackedObject = findChildObjectsWithPaths({
            childClassIds: [...new Set(childClassIds)],
            targetClassIds: target,
            currentObj: object,
            onlyUnique: false,
        }).objectsWithPath
    
        // Фильтруем дочерние объекты по связующим классам
        const filteredChildrenByTL = childrenObjectsOfTrackedObject
            .filter(child => {
                const isLinked = linking?.length > 0
                    ? linking?.some(item => child.paths.allClassArr.includes(item))
                    : true
                
                return isLinked
            })
    
        return [...new Set(filteredChildrenByTL.map(child => child.id))]

    } else {
        // Фильтруем все объекты по таргет классам
        const allChildren = objects.reduce((acc, obj) => {
            if (target?.includes(obj.class_id)) {
                acc.push(obj.id)
            }
            
            return acc
        }, []) 

        return allChildren
    }
}
import { useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useStatesStore } from '@shared/stores/states'
import { IObject } from '@shared/types/objects'
import { IObjectLinkedObjectsRackViewProps } from './ObjectLinkedObjectsRackView'
import { findAttributeValue } from './utils'

/**
 * Хук для формирования стоек по расположению
 *  
 * @param type - выбор отображения нескольких стоек или одной стойки
 * @param parentObjects - объекты для которых будут выводиться стойки c учетом расположения
 * @param unitRackRelationId - id отношения между стойкой и юнитом
 * @param unitPlacementClassId - id класса устройства для определения стороны стойки
 * @param childClassIds - id классов, по которым необходимо вывести стойки
 * @param targetClassIds - id классов, дальше которых не требуется выводить данные
 * @param visibleClassIds - id классов, которые будут отображаться в названии группы, включающей в себя стойки,
 * например здание и помещение без этажа
 * @param deviceUnitRelationIds - id отношений между юнитами и дейвайсами в юнитах
 * @param attributesBind - объект с атрибутами, по которым в массиве объектов ищем значения этих атрибутов
 * @param attributesBind.maxPower - id атрибута масимальной мощности стойки
 * @param attributesBind.currentPower - id атрибута мощности оборудования (девайса)
 * @param attributesBind.temperature - id атрибута температуры стойки (может быть атрибутом отдельного девайса)
 * @param attributesBind.humidity - id атрибута влажности помещения (может быть атрибутом отдельного девайса)
 */
export const useRackPlacements = ({
    parentObjects,
    deviceUnitRelationIds,
    unitPlacementClassId,
    unitRackRelationId,
    attributesBind,
    componentProps
}: {
    parentObjects: IObject[],
    componentProps?: any
} & Pick<
IObjectLinkedObjectsRackViewProps,
'deviceUnitRelationIds' | 'unitPlacementClassId' | 'unitRackRelationId' | 'attributesBind'
>) => {
    const objects = useObjectsStore((st) => st.store.data)
    const entities = useStateEntitiesStore((st) => st.store.data)
    const states = useStatesStore((st) => st.store.data)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const placementObjects = getObjectByIndex('class_id', unitPlacementClassId)

    const findObject = useObjectsStore((st) => st.getObjectById)

    const createPlacementsWithDevices = (parentObject: IObject) => {
        const units = (parentObject?.links_where_right || [])
            .filter((link) => link?.relation_id === unitRackRelationId)
            .map((link) => {
                const unit = findObject(link.left_object_id)
                const order = Number(findAttributeValue(unit, attributesBind?.unitOrder))

                const devices = unit.links_where_right
                    .filter(
                        (link) =>
                            deviceUnitRelationIds.includes(link.relation_id) ||
                            deviceUnitRelationIds.includes(link.relation?.original?.id)
                    )
                    .map((link) => {
                        const object = findObject(link.left_object_id)
                        const size = Number(findAttributeValue(object, attributesBind?.deviceSize))
                        const entityObject = entities.objects.find((e) => e.entity === object.id)
                        const state = states.find((s) => s.id === entityObject?.state)

                        return object
                            ? {
                                ...object,
                                state,
                                size,
                                componentProps,
                                unitId: unit?.id,
                            }
                            : null
                    })
                    .filter(Boolean)

                return { ...unit, devices, order }
            }).slice().sort((a, b) => a.order - b.order)

        const unitsDevices = units.flatMap((unit) => unit.devices.map((d) => ({ ...d, order: unit.order })))

        const placementsWithDevices = placementObjects.map((placementObject) => {
            const devicesWithPlacements = objects
                .filter((obj) => obj.links_where_left.some((link) => link.right_object_id === placementObject?.id))
                .map((device) => ({ ...device, placementId: placementObject.id }))

            return {
                id: placementObject?.id,
                name: placementObject?.name,
                devices: unitsDevices.map(({ id, name, size, order, state, componentProps }) => {
                    const placementId = devicesWithPlacements.find((dwp) => dwp.id === id)?.placementId
    
                    return { id, name, size, order, placementId, state, componentProps }
                }).filter((device) => device.placementId === placementObject.id)
            }
        })

        const rackDataKeys = ['rackSize', 'maxPower', 'currentPower', 'temperature', 'humidity'] as const
        const rackData = rackDataKeys.reduce((hash, name) => {
            return { ...hash, [name]: Number(findAttributeValue(parentObject, attributesBind?.[name])) }
        }, {} as Record<typeof rackDataKeys[number], number>)

        return {
            parentObjectId: parentObject.id,
            rackData: {
                ...rackData,
                power: Math.round((rackData.currentPower / rackData.maxPower) * 100) || 0
            },
            placementsWithDevices
        }
    }

    return parentObjects.map((obj) => createPlacementsWithDevices(obj))
}
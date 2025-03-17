import { IObjectСableTableWidgetSettings } from '@containers/widgets/ObjectСableTableWidget/types'
import { useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { findChildObjects_TEST, findChildObjectsByBaseClasses, findChildObjectsWithPaths } from '@shared/utils/objects'
import { useMemo } from 'react'
import { UTILS } from '@shared/utils';
import { useClassesStore } from '@shared/stores/classes'

type PickedClassesKeys = 'cableClasses' | 'childClassesIds' | 'targetClassesIds' | 'locationVisibleClassesIds'
    | 'attributes'
type PickedRelationsKeys = 'relationsCablePort' | 'relationsPortDevice'
type PickedKeys = PickedClassesKeys | PickedRelationsKeys
type ICablesWidget = Pick<IObjectСableTableWidgetSettings['settings']['widget'], PickedKeys>

/**
 * Формирует массив кабелей с принадлежащими ему портами и устройствам
 * 
 * @param parentObject - родительский объект для поиска дочерних и целевых объектов
 * @param widget - настройки из формы виджета WidgetObjectCableTable
 * @returns - объект с массивом объектов, содержащим информацию о родительских объектах и классах, 
 * и с массивом кабелей, содержащих также информацию о порта АБ и устройствах АБ
 */
export const useCables = (parentObject?: IObject | number, widget?: ICablesWidget) => {
    const cables = useObjectsStore((st) => st.store.data.filter((obj) => widget?.cableClasses?.includes(obj.class_id)))
    const findObject = useObjectsStore((st) => st.getByIndex)
    const referenceObject = typeof parentObject === 'number' ? findObject('id', parentObject) : parentObject

    const memoizedPayload = useMemo(() => ({
        childClassIds: widget?.childClassesIds || [],
        targetClassIds: widget?.targetClassesIds || [],
        currentObj: referenceObject,
    }), [widget?.childClassesIds, widget?.targetClassesIds, referenceObject])

    const childObjectsIds = useMemo(() => findChildObjectsByBaseClasses(memoizedPayload), [memoizedPayload])

    const { objectsWithPath } = useMemo(() => findChildObjectsWithPaths({
        ...memoizedPayload,
        visibleClasses: widget?.locationVisibleClassesIds,
    }), [memoizedPayload, widget?.locationVisibleClassesIds])

    const cablesPortsDevices = useMemo(() => cables.reduce((hash, cable) => {
        /*
        const [relationPortA, relationPortB] = cable.links_where_left.filter((link) => {
            return widget?.relationsCablePort?.includes(link.relation_id)
        })
        
         */
        //TODO:: добавить возможность задания связей с портами по original_id релейшена
        const [relationPortA, relationPortB] = cable.links_where_left

        const portA = findObject('id', relationPortA?.right_object_id)
        const portB = findObject('id', relationPortB?.right_object_id)

        //TODO:: добавить возможность задания связей с оборудованием по original_id релейшена
        const deviceA = findObject('id', portA?.links_where_left.find((link) => {
            //return widget?.relationsPortDevice.includes(link.relation_id)
            return widget.targetClassesIds.includes(link.relation.right_class_id)
        })?.right_object_id)
        const deviceB = findObject('id', portB?.links_where_left.find((link) => {
            //return widget?.relationsPortDevice.includes(link.relation_id)
            return widget.targetClassesIds.includes(link.relation.right_class_id)
        })?.right_object_id)

        if (widget?.attributes) {
            const method = widget.attributes.method
            const isDeviceAPassFilter =
                deviceA?.object_attributes?.some((oa) =>
                    (oa.attribute_id === widget.attributes.id)
                    && UTILS.OA.compareOAWithValue(oa, widget.attributes.value))

            const isDeviceBPassFilter =
                deviceB?.object_attributes?.some((oa) =>
                    (oa.attribute_id === widget.attributes.id)
                    && UTILS.OA.compareOAWithValue(oa, widget.attributes.value))

            if (widget?.attributes?.id) {
                if (method === 'both' && !(isDeviceAPassFilter && isDeviceBPassFilter)) {
                    return hash
                }

                if (method === 'some' && !(isDeviceAPassFilter || isDeviceBPassFilter)) {
                    return hash
                }
            }
        }
        
        if ([deviceA?.id, deviceB?.id].some((id) => childObjectsIds.includes(id))) {

            
            return [...hash, { cable, portA, portB, deviceA, deviceB }]
        }



        return hash
    }, [] as Record<'cable' | 'portA' | 'portB' | 'deviceA' | 'deviceB', IObject>[]),
    [cables, widget?.relationsCablePort, widget?.relationsPortDevice, childObjectsIds])

    return {
        objectsWithPath,
        cablesPortsDevices,
    } as const
}

export const useCables2 = ({
    parentObject,
    devicesClassIds,
    portClassesIds,
    cableClassesIds,
    widget,
    showWithoutDeviceB = true,
}: {
    parentObject?: IObject | number
    devicesClassIds: number[]
    portClassesIds: number[]
    cableClassesIds?: number[]
    widget?: ICablesWidget
    showWithoutDeviceB?: boolean
}) => {
    const linkedDevices: { portA?: IObject; portB?: IObject; deviceA: IObject; deviceB?: IObject; cable?: IObject }[] =
        []
    const findObject = useObjectsStore((st) => st.getByIndex)
    const referenceObject = typeof parentObject === 'number' ? findObject('id', parentObject) : parentObject
    const allClasses = useClassesStore((st) => st.store.data).map((cl) => cl.id)

    const childObjects = findChildObjectsWithPaths({
        currentObj: referenceObject,
        childClassIds: allClasses,
        targetClassIds: [],
    })?.objectsWithPath?.map((obj) => obj?.id)


    const memoizedPayload = useMemo(
        () => ({
            childClassIds: widget?.childClassesIds || [],
            targetClassIds: widget?.targetClassesIds || [],
            currentObj: referenceObject,
        }),
        [widget?.childClassesIds, widget?.targetClassesIds, referenceObject]
    )

    const { objectsWithPath } = useMemo(
        () =>
            findChildObjectsWithPaths({
                ...memoizedPayload,
                visibleClasses: widget?.locationVisibleClassesIds,
            }),
        [memoizedPayload, widget?.locationVisibleClassesIds]
    )

    const devices = useMemo(() => {
        const devicesObjects = devicesClassIds
            ?.map((deviceClass) => findObject('class_id', deviceClass))
            ?.reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
            ?.filter((obj) => childObjects.includes(obj.id))

        return devicesObjects
    }, [devicesClassIds])

    const uniqDevicesPair: string[] = []

    if (devices) {
        devices.forEach((item) => {
            const links = [...item.links_where_left, ...item.links_where_right]

            const deviceA = item
            let cable
            let portB
            let deviceB

            links.forEach((link) => {
                if (
                    portClassesIds.includes(link.relation.right_class_id) ||
                    portClassesIds.includes(link.relation.left_class_id)
                ) {
                    const portA = findObject(
                        'id',
                        item.id == link.left_object_id ? link.right_object_id : link.left_object_id
                    )

                    if (cableClassesIds) {
                        const portAAndCableLink = [...portA.links_where_left, ...portA.links_where_right].find(
                            (port) =>
                                cableClassesIds.includes(port.relation.right_class_id) ||
                                cableClassesIds.includes(port.relation.left_class_id)
                        )

                        cable = findObject(
                            'id',
                            portA.id == portAAndCableLink?.left_object_id
                                ? portAAndCableLink?.right_object_id
                                : portAAndCableLink?.left_object_id
                        )

                        if (cable) {
                            const cableAndPortBLink = [...cable.links_where_left, ...cable.links_where_right].find(
                                (port) =>
                                    (portClassesIds.includes(port.relation.right_class_id) ||
                                        portClassesIds.includes(port.relation.left_class_id)) &&
                                    port.left_object_id !== portA.id &&
                                    port.right_object_id !== portA.id
                            )

                            portB = findObject(
                                'id',
                                cable.id == cableAndPortBLink?.left_object_id
                                    ? cableAndPortBLink?.right_object_id
                                    : cableAndPortBLink?.left_object_id
                            )
                        }
                    } else {
                        const portAAndPortBLink = [...portA.links_where_left, ...portA.links_where_right].find(
                            (port) =>
                                (portClassesIds.includes(port.relation.right_class_id) ||
                                    portClassesIds.includes(port.relation.left_class_id)) &&
                                link.left_object_id !== portA.id &&
                                link.right_object_id !== portA.id
                        )

                        portB = findObject(
                            'id',
                            portA.id == portAAndPortBLink?.left_object_id
                                ? portAAndPortBLink?.right_object_id
                                : portAAndPortBLink?.left_object_id
                        )
                    }

                    if (portB !== undefined) {
                        const portBAndDeviceBLink = [...portB.links_where_left, ...portB.links_where_right].find(
                            (port) =>
                                devicesClassIds.includes(port.relation.right_class_id) ||
                                devicesClassIds.includes(port.relation.left_class_id)
                        )

                        deviceB = portBAndDeviceBLink
                            ? findObject(
                                'id',
                                portB.id == portBAndDeviceBLink.left_object_id
                                    ? portBAndDeviceBLink.right_object_id
                                    : portBAndDeviceBLink.left_object_id
                            )
                            : undefined
                    }

                    if (deviceA && deviceB) {
                        const pairOne = `${deviceA.id}-${deviceB.id}`
                        const pairTwo = `${deviceB.id}-${deviceA.id}`

                        if (uniqDevicesPair.includes(pairOne) == false && uniqDevicesPair.includes(pairTwo) == false) {
                            uniqDevicesPair.push(pairOne)
                            uniqDevicesPair.push(pairTwo)

                            linkedDevices.push({
                                deviceA: deviceA,
                                deviceB: deviceB,
                                portA: portA,
                                portB: portB,
                                cable: cable,
                            })
                        }
                    } else {
                        if (showWithoutDeviceB) {
                            linkedDevices.push({ deviceA: deviceA, portA: portA, cable: cable })
                        }
                    }
                }
            })
        })
    }

    const objectsWithPath1 = objectsWithPath


    return {
        objectsWithPath1,
        linkedDevices,
    }
}
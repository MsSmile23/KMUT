/* eslint-disable max-len */
import { useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { FC, useMemo, useState } from 'react'
import { StateLabel } from '@entities/states/StateLabels/StateLabel'
import { useRelationsStore, selectRelations } from '@shared/stores/relations'
import { findChildsByBaseClasses } from '@shared/utils/classes'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { groupByPath } from './utils'
import { Row, Col } from 'antd'
import { useRackPlacements } from './useRackPlacements'
import { ShadowCard } from './ShadowCard'
import { TelecomRack } from '@shared/ui/custom'
import { RackGroup } from './RackGroup'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useOpen } from '@shared/hooks/useOpen'
import { generalStore } from '@shared/stores/general'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export interface IObjectLinkedObjectsRackViewProps {
    type: 'single' | 'multi'
    object?: IObject | number
    unitRackRelationId?: number
    unitPlacementClassId?: number
    childClassIds: number[]
    targetClassIds: number[]
    visibleClassIds: number[]
    deviceUnitRelationIds: number[]
    attributesBind?: Partial<{
        maxPower: number
        currentPower: number
        temperature: number
        humidity: number
        unitOrder: number
        rackSize: number
        deviceSize: number
    }>
    unitsDirection?: 'direct' | 'reverse'
}

/**
 * Компонент, который выводит стойку или стойки, сгруппированные по помещениям, зданиям и т.д. 
 * с учетом расположения оборудования в юнитах
 *  
 * @param type - выбор отображения нескольких стоек или одной стойки
 * @param object - объект или номер ключа объекта, для которого будет выводиться стойка или стойки
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
 * @param unitOrder - id атрибута, отвечающего за порядковый номер юнита в стойке
 * @param rackSize - id атрибута количества юнитов в стойке
 * @param deviceSize - id атрибута, обозначающего сколько юнитов занимает устройство
 * 
 * @example
 * // Пример объекта заведения одиночной стойки
*  <ObjectLinkedObjectsRackView 
        type="single"
        object={10554} 
        childClassIds={[10055]} 
        targetClassIds={[10058]}        
        visibleClassIds={[10056]}
        deviceUnitRelationIds={forumThemeConfig.classesGroups.relationIds}
        attributesBind={{
            unitOrder: 10089,
            rackSize: 10071
        }} 
        unitRackRelationId={10037}
        unitPlacementClassId={10097}
    />
 */
export const ObjectLinkedObjectsRackView: FC<IObjectLinkedObjectsRackViewProps> = ({
    type,
    object,
    unitRackRelationId,
    unitPlacementClassId,
    childClassIds,
    targetClassIds,
    visibleClassIds,
    deviceUnitRelationIds = [],
    attributesBind,
    unitsDirection,
}) => {
    const parentObject = useObjectsStore((st) =>
        typeof object !== 'number' ? object : st.store.data.find((obj) => obj.id === object)
    )

    const relations = useRelationsStore(selectRelations)
    const findObject = useObjectsStore((st) => st.getObjectById)

    const racks = useMemo(
        () =>
            findChildObjectsWithPaths({
                targetClassIds,
                childClassIds: findChildsByBaseClasses({
                    relations,
                    classIds: childClassIds,
                    package_area: 'SUBJECT',
                }),
                currentObj: parentObject,
                visibleClasses: visibleClassIds,
            })?.objectsWithPath,
        [targetClassIds, relations, childClassIds, parentObject, visibleClassIds]
    )

    const sections = groupByPath({ data: racks, find: findObject })

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const backgroundColor = isShowcase ? createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) : 'white'

    const isMulti = type === 'multi'
    const placementsWithDevicesCollection = useRackPlacements({
        parentObjects: isMulti ? racks.map(({ id }) => findObject(id)) : [parentObject],
        deviceUnitRelationIds,
        unitPlacementClassId,
        unitRackRelationId,
        attributesBind,
        componentProps: {
            maxWidth: '100%',
        },
    })

    const { isOpen: modalVisible, close: closeModal, open: openModal } = useOpen()
    const [objectModalId, setObjectModalId] = useState(0)

    const handleDeviceClick = (deviceId) => {
        setObjectModalId(deviceId)
        openModal()
    }

    const handleClose = () => {
        closeModal()
        setObjectModalId(0)
    }

    const placementsComponentsCollection = useMemo(
        () =>
            placementsWithDevicesCollection.map((collection) => {
                return {
                    ...collection,
                    // todo: как в единичную стойку (type === 'single') добавить ее название?
                    rackData: {
                        ...collection.rackData,
                        name: findObject(collection.parentObjectId)?.name,
                    },
                    placementsWithDevices: collection.placementsWithDevices.map((pwd) => {
                        return {
                            ...pwd,
                            devices: pwd.devices.map((device) => ({
                                ...device,
                                component: (
                                    <StateLabel
                                        state={device.state}
                                        title={device.name}
                                        wrapperStyles={{
                                            minHeight: device?.size * 32,
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginTop: 7,
                                            marginBottom: 7,
                                            marginLeft: 0,
                                        }}
                                        onClick={() => handleDeviceClick(device?.id)}
                                        {...device.componentProps}
                                    >
                                        <div
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {device.name}
                                        </div>
                                    </StateLabel>
                                ),
                            })),
                        }
                    }),
                }
            }),
        [placementsWithDevicesCollection]
    )

    const racksBySections = useMemo(() => {
        return isMulti
            ? Object.entries(sections).map(([key, { objects = [], ...section }]) => ({
                ...section,
                key,
                racks: objects.map(({ id }) => {
                    return placementsComponentsCollection.find((pwd) => pwd.parentObjectId === id)
                }),
            }))
            : []
    }, [type, sections, placementsComponentsCollection])

    return (
        <div style={{ background: backgroundColor || 'transparent' }}>
            {isMulti ? (
                <Row gutter={[12, 12]}>
                    {racksBySections.map((section) => (
                        <Col xs={24} key={section.key}>
                            <RackGroup sectionName={section.name}>
                                <Row gutter={[12, 12]}>
                                    {section.racks.map((rack) => (
                                        <Col flex="1 1" key={`rack-${rack.parentObjectId}`}>
                                            <ShadowCard>
                                                <TelecomRack
                                                    parentObjectId={rack.parentObjectId}
                                                    rackName={rack.rackData.name}
                                                    rackSize={rack.rackData.rackSize}
                                                    placementsWithDevices={rack.placementsWithDevices}
                                                    temperature={rack.rackData.temperature}
                                                    humidity={rack.rackData.humidity}
                                                    currentPower={rack.rackData.currentPower}
                                                    maxPower={rack.rackData.maxPower}
                                                    unitsDirection={unitsDirection}
                                                    onDeviceClick={handleDeviceClick}
                                                />
                                            </ShadowCard>
                                        </Col>
                                    ))}
                                </Row>
                            </RackGroup>
                        </Col>
                    ))}
                </Row>
            ) : (
                placementsComponentsCollection.map((rack) => (
                    <TelecomRack
                        key={`rack-${rack.parentObjectId}`}
                        rackName={rack.rackData.name}
                        rackSize={rack.rackData.rackSize}
                        temperature={rack.rackData.temperature}
                        humidity={rack.rackData.humidity}
                        currentPower={rack.rackData.currentPower}
                        maxPower={rack.rackData.maxPower}
                        placementsWithDevices={rack.placementsWithDevices}
                        unitsDirection={unitsDirection}
                        onDeviceClick={handleDeviceClick}
                    />
                ))
            )}
            <ObjectCardModal objectId={objectModalId} modal={{ open: modalVisible, onCancel: handleClose }} />
        </div>
    )
}
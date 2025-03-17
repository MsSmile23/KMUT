import { useClassesStore } from '@shared/stores/classes';
import { useLinksStore } from '@shared/stores/links';
import { useObjectsStore } from '@shared/stores/objects';
import { IObject } from '@shared/types/objects';
import { Card, Col, Row, Table } from 'antd';
import { FC } from 'react';
import { IObjectLinkedObjectsRackViewProps } from '../ObjectLinkedObjectsRackView/ObjectLinkedObjectsRackView';
import { useStateEntitiesStore } from '@shared/stores/state-entities';
import { useStatesStore } from '@shared/stores/states';
import { IStateLAbelProps } from '@entities/states/StateLabels/StateLabel';
import { useApi2 } from '@shared/hooks/useApi2';
import { getLinks } from '@shared/api/Links/Models/getLinks/getLinks';

interface IUnitRackWidgetProps {
    object?: IObject
    unitRackRelationId?: number
    unitPlacementClassId?: number
    deviceUnitRelationIds: number[]
    attributesBind?: IObjectLinkedObjectsRackViewProps['attributesBind']
    stateLabelProps?: Omit<IStateLAbelProps, 'stateId'>
}

const findAttributeValue = (object: IObject, id: number) => {
    return object?.object_attributes?.find((oa) => oa.attribute_id === id)?.attribute_value
}

/**
 * Виджет стойки с возможностью отображения стойки с разных сторон.
 * 
 * @param object - объект стойки 
 * @param unitRackRelationId - id отношения между стойкой и юнитом
 * @param unitPlacementClassId - id класса устройства для определения стороны стойки
 * @param deviceUnitRelationIds - набор id отношений между юнитом и устройством в юните
 */
export const UnitRackWidget2: FC<IUnitRackWidgetProps> = ({
    object,
    unitRackRelationId,
    unitPlacementClassId,
    deviceUnitRelationIds = [],
    attributesBind,
    stateLabelProps
}) => {
    const objects = useObjectsStore((st) => st.store.data)
    const findObject = useObjectsStore((st) => st.getObjectById)
    const entities = useStateEntitiesStore((st) => st.store.data)
    const states = useStatesStore((st) => st.store.data)
    const links = useApi2(() => getLinks({ all: true }))?.data.filter((link) => {
        return deviceUnitRelationIds.includes(link.relation_id)
    })
    const placementObjects = useClassesStore((st) => st.store.data.find((cls) => {
        return unitPlacementClassId === cls.id
    })?.objects || [])

    const units = (object?.links_where_right || [])
        .filter((link) => link?.relation_id === unitRackRelationId)
        .map((link) => {
            const unit = findObject(link.left_object_id)
            const order = Number(findAttributeValue(unit, attributesBind?.unitOrder))

            const devices = links
                .filter((link) => link?.right_object_id === unit?.id)
                .map((link) => {
                    const object = findObject(link?.left_object_id)
                    const size = Number(findAttributeValue(object, attributesBind?.deviceSize))
                    const entityObject = entities.objects.find((e) => e.entity === object.id)
                    const state = states.find((s) => s.id === entityObject?.state)?.id

                    return object ? {
                        ...object,
                        state,
                        unitId: unit?.id,
                        size: size ?? object ? 1 : 0,
                        stateLabelProps: {
                            ...stateLabelProps,
                            onClick: () => stateLabelProps?.onClick?.(object.id)
                        }
                    } : null
                }).filter(Boolean)

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
            devices: unitsDevices.map(({ id, name, size, order, state, stateLabelProps }) => {
                const placementId = devicesWithPlacements.find((dwp) => dwp.id === id)?.placementId
        
                return { id, name, size, order, placementId, state, stateLabelProps }
            }).filter((device) => device.placementId === placementObject.id)
        }
    })

    const rackDataKeys = ['rackSize', 'maxPower', 'currentPower', 'temperature', 'humidity'] as const
    const rackData = rackDataKeys.reduce((hash, name) => {
        return { ...hash, [name]: Number(findAttributeValue(object, attributesBind?.[name])) || 0 }
    }, {} as Record<typeof rackDataKeys[number], number>)
    const power = Math.round((rackData.currentPower / rackData.maxPower) * 100) || 0
    const emptyUnits = new Array(Number(rackData.rackSize)).fill(null).map((_, i) => i + 1)

    return (
        <Row gutter={4}>
            {placementsWithDevices.map((pwd) => {
                return (
                    <Col xs={12} key={`pwd-${pwd.id}`}>
                        <Card title={pwd.name}>
                            <Table 
                                columns={[
                                    { key: 'order', dataIndex: 'order', title: 'Order', width: 40, align: 'center' },
                                    { 
                                        key: 'name', 
                                        dataIndex: 'name', 
                                        title: (
                                            <div 
                                                onClick={() => stateLabelProps?.onClick?.(pwd?.id)}
                                            >
                                                Name
                                            </div>
                                        )
                                    },
                                ]}
                                dataSource={emptyUnits.map((i) => {
                                    const device = pwd.devices.find((d) => d.order === i)

                                    return {
                                        key: `row-${i}-${device?.id}`,
                                        order: i,
                                        name: device?.name,
                                    }
                                })}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                )
            })}
        </Row>
    )
}
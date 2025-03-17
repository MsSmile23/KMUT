/* eslint-disable react/jsx-max-depth */
import { IObject } from '@shared/types/objects'
import { Card, Col, Divider, Progress, Row, Skeleton, Space, Tag, Typography } from 'antd'
import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './unitRackWidget.css'

// удалить когда появятся иконки в классах
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { selectClasses, useClassesStore } from '@shared/stores/classes/index'
import { selectStates, useStatesStore } from '@shared/stores/states'
import { green } from '@ant-design/colors'
import { IUnit, IUnitRackWidgetProps } from './types'
import { selectLinks, useLinksStore } from '@shared/stores/links'
import { UnitRackConditions } from './UnitRackConditions'
import { UnitRackTable } from './UnitRackTable'
import { getLinks } from '@shared/api/Links/Models/getLinks/getLinks'
import { useApi2 } from '@shared/hooks/useApi2'
import { useGetObjects } from '@shared/hooks/useGetObjects'

/**
 * Поиск значения атрибута в объекте по id атрибута
 * @param objects - массив всех объектов
 * @param objectId - ключ объекта для поиска в массиве объектов
 * @param conditionAttrId - атрибут для отображения состояния
 * @returns значение измеряемого атрибута
 */
const findAttributeValue = (objects: IObject[], objectId: number, conditionAttrId: number) => {
    const object = objects.find((obj) => obj.id === objectId)

    return Number(object?.object_attributes.find((oa) => oa.attribute_id === conditionAttrId)?.attribute_value)
}

/**
 * Виджет стойки
 * @param attributeIds - объект со значениями [key]: [ключ атрибута измерений, ключ атрибута измерительного устройства]
 * @param maxPower -  находим в объекте стойки object_attribute по нему и расценивать внутри как максимальную мощность
 * @param currentPower - находим в дочернем объекте класса ИБП этот атрибут и расцениваем как текущую мощность
 * @param temperature - находим в дочернем объекте класса ИБП и выводим как температуру
 * @param humidity - находим в дочернем объекте класса ИБП и выводим как влажность
 */
export const UnitRackWidget: FC<IUnitRackWidgetProps> = (props) => {
    const {
        object,
        width,
        unit,
        rackSizeId,
        deviceUnit,
        unitsFilterIds,
        attributeIds,
        rackParams,
        loading,
        unitsDirection,
    } = props

    const colors = useMemo(
        () => ({
            border: 'rgba(0, 100, 0, 1)',
            background: props.backgroundColor || 'rgba(0,140,75,1)',
            header: 'black', //был 'white
        }),
        [props.backgroundColor]
    )

    const links =
     useApi2(() => getLinks({ all: true }))?.data
    // useLinksStore(selectLinks)
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    const stateEntities = useStateEntitiesStore((st) => st.store.data)
    const states = useStatesStore(selectStates)
    const classes = useClassesStore(selectClasses)
    const rackRef = useRef<HTMLDivElement | null>(null)
    const [rackWidth, setRackWidth] = useState(0)

    const rackSize = object?.object_attributes?.find((oa) => oa.attribute_id === rackSizeId)?.attribute_value

    // для вкладок, т.к. иначе ширина не определяется
    useLayoutEffect(() => {
        setRackWidth(rackRef.current?.getBoundingClientRect?.()?.width || 0)
    }, [])

    // Получаем все линки текущего объекта (он должен быть класса Стойка)
    // относящиеся к релейшену unit_rack_relation_id
    const rackLinks = (object?.links_where_right || [])?.filter((link) => link.relation_id === unit?.rackRelationId)

    // Связанным объектам по этим линкам будут являться Юниты,
    // которые нам нужно будет разместить в нашем результирующем объекте в порядке определяемом
    // значением атрибута объекта с attribute_id = unit_order_attribute_id
    const unitsIds = rackLinks.map((link) => link.left_object_id)

    const unitsIdsSorted = [
        ...objects
            .filter((obj) => unitsIds.includes(obj.id))
            .map((obj) => obj.object_attributes.find((attr) => attr.attribute_id === unit.orderAttributeId))
            .sort((a, b) => Number(a.attribute_value) - Number(b.attribute_value)),
    ].reduce((units, objectAttr) => {
        return [...units, objectAttr?.object_id]
    }, [])

    // Для каждого Юнита находим линк Устройство -> Юнит (агрегация).
    // Для отбора таких линков используем пропсу
    const linksByRelationId = links.filter((link) => {
        return (deviceUnit?.relationIds || []).includes(link.relation_id)
    })

    const unitsBySortedIds = objects.filter((obj) => unitsIdsSorted.includes(obj.id))
    const units: IUnit[] = unitsIdsSorted
        //Находим unit
        .map((unitId) => unitsBySortedIds.find((obj) => obj.id === unitId))
        .map((unit) => {
            //Находим оборудование в unit
            const deviceObjectsFromLink =
                linksByRelationId
                    .filter((link) => link.right_object_id === unit?.id)
                    .map((link) => objects.find((obj) => obj.id === link.left_object_id)) || []

            const devices = deviceObjectsFromLink.length > 0 ? deviceObjectsFromLink : [undefined]

            return devices.map((device) => ({
                ...unit,
                device,
            }))
        })
        .reduce((acc, val) => acc.concat(val), [])
        .map((unit: IObject & { device: IObject | undefined }) => {
            const unitsWithDevices: any[] = []

            if (Array.isArray(unit.device)) {
                unit.device?.forEach((singleDevice: IObject | undefined) => {
                    if (singleDevice) {
                        const unitAttribute = unit?.object_attributes.find((attr) => {
                            return attr.attribute_id === props.unit.orderAttributeId
                        })

                        const deviceAttribute = singleDevice?.object_attributes?.find((attr) => {
                            return attr.attribute_id === deviceUnit.sizeAttributeId
                        })

                        const data = {
                            name: unit?.name,
                            id: unit?.id,
                            order: Number(unitAttribute?.attribute_value) || 0,
                        }

                        const deviceState = (stateEntities?.objects || []).find((se) => se.entity === singleDevice?.id)
                        const deviceStateData = states.find((s) => s.id === deviceState?.state)

                        unitsWithDevices.push({
                            ...data,
                            device: {
                                classId: singleDevice?.class_id,
                                id: singleDevice?.id,
                                name: singleDevice?.name || 'Устройство',
                                size: Number(deviceAttribute?.attribute_value) || 1,
                                state: deviceStateData,
                            },
                        })
                    }
                })
            } else {
                const unitAttribute = unit?.object_attributes?.find((attr) => {
                    return attr.attribute_id === props.unit.orderAttributeId
                })

                const deviceAttribute = unit?.device?.object_attributes?.find((attr) => {
                    return attr.attribute_id === deviceUnit.sizeAttributeId
                })

                const data = {
                    name: unit?.name,
                    id: unit?.id,
                    order: Number(unitAttribute?.attribute_value) || 0,
                }

                const deviceState = (stateEntities?.objects || []).find((se) => se.entity === unit?.device?.id)
                const deviceStateData = states.find((s) => s.id === deviceState?.state)

                unitsWithDevices.push({
                    ...data,
                    device: {
                        classId: unit?.device?.class_id,
                        id: unit?.device?.id,
                        name: unit?.device?.name || 'Устройство',
                        size: Number(deviceAttribute?.attribute_value) || 1,
                        state: deviceStateData,
                    },
                })
            }

            return unitsWithDevices
        })
        .reduce((acc, val) => acc.concat(val), [])
        .filter((unit) => (unitsFilterIds ? unitsFilterIds.includes(unit.id) : true))

    //Объекты определяющие расположения оборудования в юните
    const placementObjects = classes
        .filter((obj) => deviceUnit?.unitPlacements?.includes(obj.id))
        .flatMap((o) => o.objects)

    const unitsByPlacement = placementObjects.map((placement) => {
        const filterObjectsByPlacement = objects.filter((obj) =>
            obj.links_where_left.some((link) => link.right_object_id === placement.id)
        )

        const matchedUnits = units.filter((unit) => {
            const deviceIds = Array.isArray(unit.device) ? unit.device.map((obj) => obj.id) : [unit.device.id]

            return deviceIds.some((id) => filterObjectsByPlacement.some((obj) => obj.id === id))
        })

        const unitsWithDevice = matchedUnits.map((unit) => {
            return {
                ...unit,
                device: Array.isArray(unit.device)
                    ? unit.device.find(() => filterObjectsByPlacement.some((obj) => obj.id === obj.id))
                    : unit.device,
            }
        })

        return {
            group_object: placement,
            units: unitsWithDevice,
        }
    })

    const rackName = object?.name || ''
    const enoughWidth = (Number(width) || rackWidth) >= 450 && rackName.length <= 30

    const devicesIds = {
        maxPower: findDeviceId(units, attributeIds?.maxPower[1]),
        currentPower: findDeviceId(units, attributeIds?.currentPower[1]),
        temperature: findDeviceId(units, attributeIds?.temperature[1]),
        humidity: findDeviceId(units, attributeIds?.humidity[1]),
    }

    function findDeviceId(units: IUnit[], classId: number): number | undefined {
        const devices = units.map((unit) => (Array.isArray(unit.device) ? unit.device : [unit.device])).flat()
        const devicesId = devices.find((device) => device?.classId == classId)?.id

        return devicesId
    }

    const maxPower = findAttributeValue(objects, devicesIds.maxPower, attributeIds?.maxPower[0]) ?? rackParams?.maxPower
    const currentPower =
        findAttributeValue(objects, devicesIds.currentPower, attributeIds?.currentPower[0]) ?? rackParams?.currentPower
    const temperature =
        findAttributeValue(objects, devicesIds.temperature, attributeIds?.temperature[0]) ?? rackParams?.temperature
    const humidity = findAttributeValue(objects, devicesIds.humidity, attributeIds?.humidity[0]) ?? rackParams?.humidity

    const isNumber = (value) => !Number.isNaN(Number(value))

    return (
        <Col className="rack-container">
            {unitsByPlacement.map((obj, index) => (
                <div key={index} style={{ flex: '1 1', width: 250 }} className="rack-custom-table">
                    {obj?.group_object?.name && (
                        <p
                            style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            {obj?.group_object?.name}
                        </p>
                    )}
                    <Row
                        ref={rackRef}
                        gutter={[0, 8]}
                        className="rack"
                        style={{
                            border: `1px solid ${colors.border}`,
                            background: '#F3F3F3', //хардкод по Figma - серый фон
                            // background: colors.background,
                            width,
                        }}
                    >
                        <Col xs={24}>
                            <Row align="middle" justify="space-between">
                                <Col flex="1 0" className="rack-name" style={{ color: colors.header }}>
                                    {loading ? 'Загрузка...' : rackName}
                                </Col>

                                {temperature !== undefined && humidity !== undefined && enoughWidth && (
                                    <Col flex="0 1">
                                        <UnitRackConditions
                                            temperature={{ color: 'green', value: temperature }}
                                            humidity={{ color: 'orange', value: humidity }}
                                            loading={loading}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Col>

                        {maxPower !== undefined &&
                            isNumber(maxPower) &&
                            currentPower !== undefined &&
                            isNumber(currentPower) && (
                            <>
                                <Col xs={24} className="rack-power-title">
                                    {loading ? (
                                        <Skeleton.Button active block size="small" />
                                    ) : (
                                        <Space>
                                            <Typography.Text style={{ color: 'inherit' }}>
                                                    Потребление мощности:
                                            </Typography.Text>
                                            <Tag color="green">
                                                {Math.round((currentPower / maxPower) * 100) || 0}%
                                            </Tag>
                                        </Space>
                                    )}
                                </Col>
                                <Col xs={24} className="rack-power-bar">
                                    {loading ? (
                                        <Skeleton.Button active block />
                                    ) : (
                                        <Progress
                                            format={(percent) => <Tag color={green[6]}>{`${percent} %`}</Tag>}
                                            style={{ margin: 0, padding: 4 }}
                                            size={[rackWidth - 30, 20]}
                                            strokeColor={green[6]}
                                            percent={Math.round((currentPower / maxPower) * 100)}
                                            showInfo={false}
                                        />
                                    )}
                                </Col>
                            </>
                        )}

                        <Divider style={{ margin: 2, backgroundColor: 'white' }} />
                        <Col xs={24}>
                            <Card bodyStyle={{ padding: 2 }}>
                                <UnitRackTable
                                    rackSize={Number(rackSize)}
                                    units={obj.units}
                                    loading={loading}
                                    unitsDirection={unitsDirection}
                                />
                            </Card>
                        </Col>
                        <Col xs={24}>
                            <div style={{ textAlign: 'center', color: colors.header }}></div>
                        </Col>
                    </Row>
                </div>
            ))}
        </Col>
    )
}
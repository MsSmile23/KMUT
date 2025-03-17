import { objectsStore, selectObjects } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Button, TableProps } from 'antd'
import { FC, useCallback, useMemo, useState } from 'react'
import { IChildObjectWithPaths } from '@shared/utils/objects'
import { ApartmentOutlined } from '@ant-design/icons'
import { useAttributesStore } from '@shared/stores/attributes'
import { intersection } from 'lodash'
import { useRelationsStore } from '@shared/stores/relations'
import { cableTableTranslation } from '@containers/widgets/ObjectСableTableWidget/data'
import { createColumn, createSide, defineAttributeView, findAttribute } from './utils'
import { ObjectTableCell } from './ObjectTableCell'
import ObjectCableMap from '../ObjectCableMap/ObjectCableMap'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useGetObjects } from '@shared/hooks/useGetObjects'

export interface IObjectCableTable2 extends TableProps<any> {
    columnsAttributesIds?: number[]
    upDownAttributeId?: number
    attributeIdPortName?: number
    objectsWithPath?: IChildObjectWithPaths[],
    cablesPortsDevices?: Record<'cable' | 'portA' | 'portB' | 'deviceA' | 'deviceB', IObject>[] | {
        portA?: IObject;
        portB?: IObject;
        deviceA: IObject;
        deviceB?: IObject;
        cable?: IObject;
    }[]
    paintCablesByState?: boolean
    parentObject?: any
    portClasses?: number[],
    devicesClasses?: number[],
}

/**
 * Кабельный журнал
 * 
 * @param columnsAttributesIds - id атрибутов, которые нужно отобразить как столбцы
 * @param upDownAttributeId - id атрибута, отвечающего за свойство uplink
 * @param attributeIdPortName - id атрибута, указывающего на название порта
 * @param objectsWithPath - массив объектов с информацией о родительских классах
 * @param cablesPortsDevices - массив объектов, каждый из которых включает в себя информацию 
 * о кабеле, портах АБ и устройствах
 * @param paintCablesByState - окрашивать ли кабель на карте сети в цвет их состояния
 */
export const ObjectCableTable2: FC<IObjectCableTable2> = ({
    columnsAttributesIds,
    upDownAttributeId,
    attributeIdPortName,
    objectsWithPath, 
    cablesPortsDevices,
    paintCablesByState,
    parentObject,
    portClasses,
    devicesClasses,
    ...props
}) => {

    const filteredAttributes = useAttributesStore((st) => {
        return st.store.data.filter((attr) => columnsAttributesIds?.includes(attr.id))
    })
    const relationsRightClass = useRelationsStore((st) => st.store.data.map((rel) => rel.right_class_id))
    const relationsLeftClass = useRelationsStore((st) => st.store.data.map((rel) => rel.left_class_id))

    const columns = Object.entries(cableTableTranslation)
        .filter(([ key ]) => key !== 'cableType')
        .map(([ key, { base } ]) => createColumn(key, base))
    // todo: возможно стоит убрать второй уровень?
    const attributeColumns = useMemo(() => ['deviceA', 'portA', 'deviceB', 'portB']
        .map((column) => ({
            title: cableTableTranslation[column]?.attribute,
            key: `attribute${column}`, 
            dataIndex: `attribute${column}`,
            // на второй уровень отправляем все атрибуты
            children: filteredAttributes
                .filter((attr) => intersection(column.includes('device') 
                    ? relationsRightClass 
                    : relationsLeftClass, attr.classes_ids.map(({ id }) => id)
                ).length > 0)
                .map((attr) => {
                // todo: сделать сортировку и фильтрацию для второго уровня
                // return createColumn(`${k}_${attr.id}`, attr.name, { whiteSpace: 'nowrap', align: 'center' })
                    return {
                        childKey: `${column}_${attr.id}`,
                        childName: attr.name
                    }
                })
        }))
        .filter((col) => col.children.length > 0)
        .map((col) => col.children.map((child) => ({ ...child, parentTitle: col.title }))).flat().map((col) => {
            const title = [`${col.childName}`, `(${col.parentTitle})`] as [string, string]
    
            return createColumn(col.childKey, title, { align: 'center', whiteSpace: 'break-spaces' })
        }),
    [relationsRightClass, relationsLeftClass])

    const filterColumns = useCallback((entity: 'device' | 'port', side: 'A' | 'B') => columns.filter((col) => {
        return col?.dataIndex === `${entity}${side}` || col?.dataIndex  === `${entity}Class${side}`
    }), [columns])

    const filterAttributeColumns = useCallback((entity: 'device' | 'port', side: 'A' | 'B') => {
        return attributeColumns.filter((col) => col?.dataIndex.includes(`${entity}${side}`))
    }, [attributeColumns])

    /**
     * Изначальный порядок столбцов (даже невидимых по умолчанию, в настройках столбцов) 
     * меняем по принципу сначала все столбцы имеющие отношение к Оборудования А, 
     * потом все столбцы Порт А, потом Порт Б и Оборудование Б
     */
    const orderedColumns = useMemo(() => (['A', 'B'] as const).reduce((arr, side) => [
        ...arr,
        ...filterColumns('device', side),
        columns.find((col) => col.key === `deviceLocation${side}`),
        ...filterAttributeColumns('device', side),
        ...filterColumns('port', side),
        ...filterAttributeColumns('port', side),
        createColumn('cableType', cableTableTranslation.cableType.base)
    ], []), [filterColumns, columns, filterAttributeColumns])


    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [isMapModalVisible, setIsMapModalVisible] = useState<boolean>(false)
    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)
    const objects = useGetObjects()

    const objectModal = objects.find((obj) => obj.id === objForModalId)

    const onClickCell = (objectId: number) => {
        setIsModalVisible(true)
        setObjForModalId(objectId)
    }

    const rows = useMemo(() => cablesPortsDevices.map(({ cable, portA, portB, deviceA, deviceB }) => {
        const isUplinkPortA = Boolean(portA?.object_attributes.find((oa) => {
            return oa.attribute_id === upDownAttributeId
        })?.attribute_value)

        const a = createSide(deviceA, portA, objectsWithPath)
        const b = createSide(deviceB, portB, objectsWithPath)

        // если порт uplink то он и его устройство должны отображаться как Устройство Б (справа), 
        // если downlink то как Устройство А (downlink)
        const { left, right } = isUplinkPortA ? ({ left: b, right: a }) : ({ left: a, right: b })

        return {
            key: `cable-${cable ? cable.id : `${deviceB?.id}-${deviceA?.id}-${portA?.id}`}`,
            deviceAId: isUplinkPortA ? deviceA?.id : deviceB?.id,
            deviceA: <ObjectTableCell item={left.device} title={findAttribute} onClick={onClickCell} />,
            deviceClassA: left.deviceClass,
            deviceLocationA: left.deviceLocation,
            deviceB: <ObjectTableCell item={right.device} title={findAttribute} onClick={onClickCell} />,
            deviceClassB: right.deviceClass,
            deviceLocationB: right.deviceLocation,
            portA: (
                <ObjectTableCell 
                    item={left.port} 
                    title={() => findAttribute(left.port, attributeIdPortName)} 
                    onClick={onClickCell} 
                />
            ),
            portClassA: left.portClass,
            portB: (
                <ObjectTableCell 
                    item={right.port} 
                    title={() => findAttribute(left.port, attributeIdPortName)} 
                    onClick={onClickCell} 
                />
            ),
            portClassB: right.portClass,
            ...(filteredAttributes.reduce((obj, attr) => {
                return {
                    ...obj,
                    [`deviceA_${attr.id}`]: defineAttributeView(left.device, attr.id),
                    [`deviceB_${attr.id}`]: defineAttributeView(right.device, attr.id),
                    [`portA_${attr.id}`]: defineAttributeView(left.port, attr.id),
                    [`portB_${attr.id}`]: defineAttributeView(right.port, attr.id),
                }
            }, {})),
            cableType: cable ? (
                <ObjectTableCell 
                    item={cable}
                    title={cable.class.name}
                    onClick={onClickCell}
                />
            ) : '-'
        }
    }), [cablesPortsDevices, upDownAttributeId])

    const handleClose = () => {
        setIsModalVisible(false)
        setObjForModalId(undefined)
    }

    return (
        <>
            <ObjectCardModal 
                objectId={objForModalId} 
                modal={{ 
                    title: objectModal?.class?.name,
                    open: isModalVisible, 
                    onCancel: handleClose }} 
            />
            <DefaultModal2
                width="80%"
                height="80vh"
                title="Карта сети"
                open={isMapModalVisible}
                onCancel={() => setIsMapModalVisible(false)}
                footer={null}
                centered
            >
                <WrapperCard style={{ marginTop: 20 }}>
                    <ObjectCableMap
                        parentObject={parentObject}
                        cablesPortsDevices={cablesPortsDevices}
                        paintCablesByState={paintCablesByState}
                        devicesClasses={devicesClasses}
                        portClasses={portClasses}
                        height="70vh"
                        {...props}
                    />
        
                </WrapperCard>
            </DefaultModal2>
            <EditTable
                columns={orderedColumns} 
                rows={rows} 
                tableId="object-cable-table-2"
                style={{ height: '100%' }}
                buttons={{
                    right: [
                        <Button
                            shape="circle"
                            size="large" 
                            key="network-map" 
                            onClick={() => setIsMapModalVisible(true)}
                            icon={<ApartmentOutlined />}
                        />
                    ]
                }}
                scroll={{ x: 2100 }}
                {...props}
            />
        </>
    )
}

export default ObjectCableTable2
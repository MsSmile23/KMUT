import { objectsStore, selectObjects } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Button, Col, Row, Space, TableProps } from 'antd'
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { findChildObjectsByBaseClasses, findChildObjectsWithPaths } from '@shared/utils/objects';
import { IClass } from '@shared/types/classes';
import NetworkMap from '@entities/objects/NetworkMap/NetworkMap';
import { ApartmentOutlined } from '@ant-design/icons'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { intersection } from 'lodash'
import { useRelationsStore } from '@shared/stores/relations'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import ObjectCableMap from '../ObjectCableMap/ObjectCableMap'
import { useGetObjects } from '@shared/hooks/useGetObjects'


export interface IObjectCableTable extends TableProps<any> {
    cableClasses?: number[]
    relationsCablePort: number[]
    relationsPortDevice?: number[]
    parentObject?: IObject, //Родительский объект
    childClsIds?: IClass['id'][],
    targetClsIds?: IClass['id'][],
    height?: number
    upDownAttributeId?: number
    columnsAttributesIds?: number[]
    maxSearchDepth?: number
    attributeIdPortName?: number
    locationVisibleClassesIds?: number[]
}

const sortFCRows = (a: any, b: any, key: string) => {
    return a?.[key]?.props?.children?.localeCompare(b?.[key]?.props?.children)
}

const findAttribute = (obj: IObject, attributeId?: number, name = true) => obj?.object_attributes.find((oa) => {
    return oa.attribute_id == attributeId
})?.attribute_value ?? (name ? obj?.name : '')

const findAttributeInfo = (obj: IObject, attributeId?: number) => obj?.object_attributes.find((oa) => {
    return oa.attribute_id == attributeId
})

const defineAttributeView = (obj: IObject, id: number) => {
    const attr = findAttributeInfo(obj, id)

    switch (attr?.attribute.data_type.inner_type) {
        case 'boolean': 
            return attr?.attribute_value ? <CheckGreen /> : <CloseOutlined />
        
        default:
            return attr?.attribute_value
    }
}

const Cell: FC<{ 
    item: IObject, 
    title?: string | ((obj: IObject) => string)
    onClick: (id: number) => void
}> = ({ item, title, onClick }) => (
    <div
        onClick={() => {
            onClick(item?.id)
        }}
        style={{ cursor: 'pointer' }}
    >
        {typeof title === 'function' ? title?.(item) : title}
    </div>
)

const CheckGreen: FC = () => <CheckOutlined style={{ color: '#1ed960' }} />

const createColumn = (key: string, title: string | [string, string], options?: {
    whiteSpace?: React.CSSProperties['whiteSpace'], 
    fixed?: 'left' | 'right', 
    align?: 'left' | 'center' | 'right',
}) => {
    const styles = { 
        textAlign: 'center' as const, 
        whiteSpace: options?.whiteSpace,
        // todo: вынести в отдельные стили
        fontSize: 16, fontWeight: 700
    }

    const isTitleString = typeof title === 'string'

    return {
        key,
        title: isTitleString
            ? (<div style={styles}>{title}</div>)
            : (
                <Row>
                    <Col xs={24} style={styles}>{title[0]}</Col>
                    <Col xs={24} style={styles}>{title[1]}</Col>
                </Row>
            ),
        dataIndex: key,
        sorter: (a, b) => sortFCRows(a, b, `${key}`),
        fixed: options?.fixed,
        align: options?.align,
        sortableTitle: isTitleString ? title : `${title[0]} ${title[1]}`
    }
}

/**
 * Кабельный журнал
 * @param columnsAttributesIds - id атрибутов, которые нужно отобразить как столбцы
 * @returns 
 */
const ObjectCableTable: FC<IObjectCableTable> = ({
    cableClasses,
    relationsCablePort,
    relationsPortDevice,
    parentObject,
    childClsIds,
    targetClsIds,
    height,
    upDownAttributeId,
    columnsAttributesIds,
    maxSearchDepth,
    attributeIdPortName,
    locationVisibleClassesIds,
    ...props
}) => {
    const tr = {
        deviceA: {
            base: 'Наименование',
            attribute: 'Оборудование'
        },
        deviceClassA: {
            base: 'Класс оборудования',
        },
        deviceLocationA: {
            base: 'Расположение оборудования',
        },
        portA: {
            base: 'Порт подключения',
            attribute: 'Порт'
        },
        portClassA: {
            base: 'Класс порта подключения',
        },
        deviceB: {
            base: 'Наименование подключаемого оборудования',
            attribute: 'Подключаемое оборудование'
        },
        deviceClassB: {
            base: 'Класс подключаемого оборудования',
        },
        deviceLocationB: {
            base: 'Расположение подключаемого оборудования',
        },
        portB: {
            base: 'Порт подключаемого оборудования',
            attribute: 'Порт подключаемого оборудования'
        },        
        portClassB: {
            base: 'Класс порта подключаемого оборудования',
        },
        cableType: {
            base: 'Тип кабеля',
            attribute: 'Тип кабеля'
        }
    }

    const columns = Object.entries(tr)
        .filter(([ key ]) => key !== 'cableType')
        .map(([ key, { base } ]) => createColumn(key, base))

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [isMapModalVisible, setIsMapModalVisible] = useState<boolean>(false)
    const [rows, setRows] = useState<any[]>([])
    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)
    const objects = useGetObjects()
    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)

    const [oidsFilterState, setOidsFilterState] = useState<undefined | IObject['id'][]>(undefined)

    const objectModal = objects.find((obj) => obj.id === objForModalId)

    const onClickCell = (objectId) => {
        setIsModalVisible(true)
        setObjForModalId(objectId)
    }

    const classes = useClassesStore(selectClasses)

    const attributes = useAttributesStore(selectAttributes)
    const filteredAttributes = attributes.filter((attr) => columnsAttributesIds?.includes(attr.id))

    const relations = useRelationsStore(s => s.store.data.filter((rel) => relationsPortDevice.includes(rel.id)))

    const attributeColumns = [
        ['deviceA', tr.deviceA.attribute],
        ['portA', tr.portA.attribute],
        ['deviceB', tr.deviceB.attribute],
        ['portB', tr.portB.attribute],
    ].map(([ k, title ]) => ({
        title,
        key: `attribute${k}`, 
        dataIndex: `attribute${k}`,
        // на второй уровень отправляем все атрибуты
        children: filteredAttributes
            .filter((attr) => {
                const ids = attr.classes_ids.map(({ id }) => id)

                if (k.includes('device')) {
                    return intersection(relations.map((rel) => rel.right_class_id), ids).length > 0
                } else {
                    return intersection(relations.map((rel) => rel.left_class_id), ids).length > 0
                }
            })
            .map((attr) => {
                // todo: сделать сортировку и фильтрацию для второго уровня
                // return createColumn(`${k}_${attr.id}`, attr.name, { whiteSpace: 'nowrap', align: 'center' })
                return {
                    childKey: `${k}_${attr.id}`,
                    childName: attr.name
                }
            })
    })).filter((col) => col.children.length > 0)

    const flattenAttributeColumns = attributeColumns.map((col) => {
        return col.children.map((child) => ({ ...child, parentTitle: col.title }))
    }).flat().map((col) => {
        const title = [`${col.childName}`, `(${col.parentTitle})`] as [string, string]

        return createColumn(col.childKey, title, { align: 'center', whiteSpace: 'break-spaces' })
    })

    const filterColumns = (entity: 'device' | 'port', side: 'A' | 'B') => columns.filter((col) => {
        return col?.dataIndex === `${entity}${side}` || col?.dataIndex  === `${entity}Class${side}`
    })
    const filterAttributeColumns = (entity: 'device' | 'port', side: 'A' | 'B') => {
        return flattenAttributeColumns.filter((col) => col?.dataIndex.includes(`${entity}${side}`))
    }

    /**
     * Изначальный порядок столбцов (даже невидимых по умолчанию, в настройках столбцов) 
     * меняем по принципу сначала все столбцы имеющие отношение к Оборудования А, 
     * потом все столбцы Порт А, потом Порт Б и Оборудование Б
     */
    const orderedColumns = (['A', 'B'] as const).reduce((arr, side) => [
        ...arr,
        ...filterColumns('device', side),
        columns.find((col) => col.key === `deviceLocation${side}`),
        ...filterAttributeColumns('device', side),
        ...filterColumns('port', side),
        ...filterAttributeColumns('port', side),
    ], [])

    const resultColumns = [
        ...orderedColumns,
        createColumn('cableType', tr.cableType.base)
    ]

    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
    }, [])
    useEffect(() => {
        const localRows: any[] = []
        const devicesACount = {}
        const cables = objects.filter((obj) => cableClasses.includes(obj.class_id))

        let oidsFilter: IObject['id'][] = []

        if (parentObject) {
            oidsFilter = findChildObjectsByBaseClasses({
                childClassIds: [
                    //...forumThemeConfig.classesGroups?.buildings || [],
                    ...forumThemeConfig.classesGroups?.services || [],
                    ...forumThemeConfig.classesGroups?.rooms || [],
                    ...forumThemeConfig.classesGroups?.floors || [],
                    ...forumThemeConfig.classesGroups?.racks || [],
                    ...forumThemeConfig.classesGroups?.favor || [],
                    ...forumThemeConfig.classesGroups?.units || [],
                ],
                targetClassIds: forumThemeConfig.classesGroups?.devices || [],
                currentObj: parentObject,
                depth: maxSearchDepth
            })
        }
        setOidsFilterState(oidsFilter)

        const { objectsWithPath } = findChildObjectsWithPaths({
            // childClassIds: childClsIds,
            // targetClassIds: targetClsIds,
            childClassIds: [
                ...forumThemeConfig.classesGroups?.rooms || [],
                ...forumThemeConfig.classesGroups?.floors || [],
                ...forumThemeConfig.classesGroups?.racks || [],
                ...forumThemeConfig.classesGroups?.units || [],
                //[10056, 10105, 10058, 10082]
            ],
            /*
            targetClassIds: [10061, 10071, 10072, 10073, 10074, 10075, 10076, 10077,
                10078, 10079, 10080, 42, 10084, 10085, 10087, 40, 10088, 10089, 10090, 10086
            ],

             */
            targetClassIds: forumThemeConfig.classesGroups.devices,
            visibleClasses: locationVisibleClassesIds,
            currentObj: parentObject,
        })

        cables.forEach((cable) => {
            const relations = cable?.links_where_left.filter((link) => relationsCablePort.includes(link.relation_id))

            const portA = objects.find((obj) => obj.id == relations[0]?.right_object_id)
            const portB = objects.find((obj) => obj.id == relations[1]?.right_object_id)

            const findDevice = (searchedObj: IObject) => objects.find((obj) => {
                return obj.id == searchedObj?.links_where_left.find((link) => {
                    return relationsPortDevice.includes(link.relation_id)
                })?.right_object_id
            })
            const findClassName = (obj: IObject) => {
                return classes.find((cls) => cls.id === obj?.class_id)?.name
            }

            const deviceA = findDevice(portA)
            const deviceB = findDevice(portB)

            const deviceClassNameA = findClassName(deviceA)
            const deviceClassNameB = findClassName(deviceB)
            const portClassNameA = findClassName(portA)
            const portClassNameB = findClassName(portB)
            
            if (oidsFilter?.includes(deviceA?.id) || oidsFilter?.includes(deviceB?.id)) {
                devicesACount[deviceA?.id] == undefined
                    ? (devicesACount[deviceA?.id] = 1)
                    : (devicesACount[deviceA?.id] += 1)

                const isUplinkPortA = portA?.object_attributes.find((oa) => {
                    return oa.attribute.id === upDownAttributeId
                })?.attribute_value
                
                const findLocation = (deviceId: number) => objectsWithPath.find(({ id }) => {
                    return id === deviceId
                })?.paths?.visibleArr?.map(({ name }) => name)?.join(', ')

                const a = {
                    device: deviceA, 
                    port: portA, 
                    deviceClass: deviceClassNameA,
                    deviceLocation: findLocation(deviceA?.id), 
                    portClass: portClassNameA 
                }

                const b = { 
                    device: deviceB, 
                    port: portB, 
                    deviceClass: deviceClassNameB, 
                    deviceLocation: findLocation(deviceB?.id),
                    portClass: portClassNameB 
                }

                // если порт uplink то он и его устройство должны отображаться как Устройство Б (справа), 
                // если downlink то как Устройство А (downlink)
                const { left, right } = isUplinkPortA 
                    ? ({ left: b, right: a }) 
                    : ({ left: a, right: b })

                localRows.push({
                    key: cable.id,
                    deviceAId: isUplinkPortA ? deviceA?.id : deviceB?.id,
                    deviceA: <Cell item={left.device} title={findAttribute} onClick={onClickCell} />,
                    deviceClassA: left.deviceClass,
                    deviceLocationA: left.deviceLocation,
                    deviceB: <Cell item={right.device} title={findAttribute} onClick={onClickCell} />,
                    deviceClassB: right.deviceClass,
                    deviceLocationB: right.deviceLocation,
                    portA: (
                        <Cell 
                            item={left.port} 
                            title={() => findAttribute(left.port, attributeIdPortName)} 
                            onClick={onClickCell} 
                        />
                    ),
                    portClassA: left.portClass,
                    portB: (
                        <Cell 
                            item={right.port} 
                            title={() => findAttribute(right.port, attributeIdPortName)}
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

                    cableType: (
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => onClickCell(cable?.id)}
                        >
                            {cable.class.name}
                        </div>
                    ),
                })
            }
        })

        // todo: восстановить rowSpan
        setRows(localRows.sort((a, b) => Number(a.deviceAId) - Number(b.deviceAId)))
    }, [objects, maxSearchDepth])

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
                onCancel={() => {
                    setIsMapModalVisible(false)
                }}
                // destroyOnClose
                footer={null}
                centered
            >
                <WrapperCard style={{ marginTop: 20 }}>
                    {' '}

                 
                    <NetworkMap
                        cableClasses = {cableClasses}
                        relationsCablePort = {relationsCablePort}
                        relationsPortDevice = {relationsPortDevice}
                        oidsFilter={oidsFilterState}
                        height="70vh"
                    />
                </WrapperCard>
            </DefaultModal2>
            <Col
                ref={ref}
                span={24}
                style={
                    height
                        ? {
                            padding: '5px',
                            height: `${height}px`,
                            overflowY: clientHeight > Number(height) ? 'scroll' : 'auto',
                            overflowX: clientHeight > Number(height) ? 'clip' : 'auto',
                            textAlign: 'center',
                        }
                        : { padding: '5px', textAlign: 'center' }
                }
            >
                <Space>
                    
                </Space>
                <EditTable
                    columns={resultColumns} 
                    rows={rows} 
                    tableId="object-cable-table"
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
            </Col>
        </>
    )
}

export default ObjectCableTable
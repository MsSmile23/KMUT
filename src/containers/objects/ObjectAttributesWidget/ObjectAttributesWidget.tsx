import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { SimpleTable } from '@shared/ui/tables'
import { getRelationProps } from '@shared/utils/relations'
import { findChildObjectsWithPaths, findChildObjects_TEST, getObjectName2 } from '@shared/utils/objects'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { IObjectAttribute } from '@shared/types/objects'
import { OAView } from '@entities/objects/OAView/OAView'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useGetObjects } from '@shared/hooks/useGetObjects'

export interface IObjectAttributesWidget {
    attributeCategory?: number
    attributesIds?: number[]
    title?: string
    objectId: number
    height?: number
    showLinks?: boolean
    displayType?: 'table' | 'strings'
    linkedObjects?: {
        targetClasses: {
        class_id: number, 
        showClassName: boolean, 
        attributeIds?: number[]

    }[], connectingClasses: number[]},
    // todo: заменить на массив с подключением нескольких атрибутов [{ id, title }]
    // в данный момент разделяет одну на таблицу на две (услуга и здание)
    divided?: boolean
    oaSortOrder?: number[]
}

const columns: ColumnsType<any> = [
    {
        title: 'Атрибут',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        ellipsis: true,
    },
    {
        title: 'Значение',
        dataIndex: 'value',
        key: 'value',
        width: '50%',
        ellipsis: true,
    },
]
const ObjectAttributesWidget: FC<IObjectAttributesWidget> = ({
    attributeCategory,
    attributesIds,
    objectId,
    height,
    showLinks,
    displayType = 'table',
    divided = false,
    linkedObjects,
    oaSortOrder
}) => {
    const objects = useGetObjects()
    const [dataSource, setDataSource] = useState<any[]>([])
    const [ rows, setRows ] = useState({
        building: [] as any[],
        service: [] as any[]
    })
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [rightObjectId, setRightObjectId] = useState<number | undefined>(undefined)

    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)

    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
    }, [])

    useEffect(() => {
        setRows(() => ({
            building: [] as any[],
            service: [] as any[]
        }))

        if (objects?.length > 0) {
            const object = objects?.find((obj) => obj?.id == objectId)

            if (object !== undefined) {
                let objectAttributes = object?.object_attributes
                    .filter((oa) =>
                        ['public', 'private'].includes(oa.attribute.visibility)
                    )
                    .map((oa) => {
                        if (oaSortOrder && oaSortOrder.length > 0) {
                            const idx = oaSortOrder.indexOf(oa.id)

                            return {
                                ...oa,
                                attribute: {
                                    ...oa?.attribute,
                                    sort_order: idx < 0 
                                        ? 10000 + oa?.attribute?.sort_order
                                        : idx
                                }
                            }
                        } else {
                            return oa
                        }
                          
                    })
                    .sort((a, b) => {
                        return a?.attribute?.sort_order - b?.attribute?.sort_order
                    })

                if (attributeCategory !== undefined) {
                    objectAttributes = objectAttributes.filter(
                        (attr) => attr.attribute.attribute_category_id == attributeCategory
                    )
                }

                if (attributesIds !== undefined) {
                    // порядок атрибутов как в пропсе массива атрибутов
                    objectAttributes = attributesIds.reduce((acc, attr) => {
                        const newAttr = objectAttributes.find(objAttr => {
                            return objAttr.attribute_id === attr
                        })

                        if (newAttr) {
                            acc.push(newAttr)
                        }

                        return acc 
                    }, []) as unknown as IObjectAttribute[]
                }

                const rows: any[] = objectAttributes?.map((attr) => {

                    return {
                        name: attr?.attribute?.name,
                        value: <OAView objectAttribute={attr} enableStateText style={{ fontSize: '24px' }} />,
                        key: `attr_${attr?.id}`,
                    }
                })

                // todo: выяснить почему внутри хука мутированный rows2
                const rows2 = rows.slice()

                if (divided) {
                    // todo: вместе service использовать динамический ключ
                    setRows((data) => ({ ...data, service: rows2 }))
                }

                if (showLinks) {
                    object.links_where_left.forEach((link) => {
                        if (link.relation.relation_type == 'association') {
                            rows.push({
                                name: getRelationProps(link.relation).name,
                                value: (
                                    <Typography.Text
                                        style={{
                                            marginRight: '10px',
                                            cursor: 'pointer',
                                            borderBottom: '1px dashed #000080',
                                        }}
                                        onClick={() => {
                                            setIsModalVisible(true)
                                            setRightObjectId(link.right_object_id)
                                        }}
                                    >
                                        {getObjectName2(objects.find((obj) => obj.id == link.right_object_id))}
                                    </Typography.Text>
                                ),
                                key: `link_${link.id}`,
                            })
                        }
                    })
                }

                if (linkedObjects !== undefined) {
                    linkedObjects.targetClasses.forEach(obj => {
                        const childrenObjects = findChildObjectsWithPaths({
                            currentObj: objects.find(item => objectId == item.id),
                            childClassIds: [], targetClassIds: [obj.class_id] }, )?.objectsWithPath

                        const parentObjects = findChildObjects_TEST(
                            {
                                object: objects.find(item => objectId == item.id),
                                targetClasses: linkedObjects.connectingClasses, 
                                objects: objects 
                            }
                        )

                        parentObjects.forEach(item => {
                            const finedObject  = objects.find(ob => ob.id == item.id)

                            if ( item.class_id ==  obj.class_id) {
                                if (obj.showClassName) {
                                    const row = {
                                        name: finedObject.class.name,
                                        value: finedObject.name
                                    }

                                    rows.push(row)

                                    

                                    if (divided) {
                                        setRows((data) => ({ 
                                            ...data, 
                                            building: [...data.building, row] 
                                        }))
                                    }

                                    if (obj.attributeIds?.length > 0) {
                                        const attributes = finedObject.object_attributes
                                            .filter(attr => obj.attributeIds.includes(attr.attribute_id))
                                            .map(attr => {
                                                const row = {
                                                    name: attr.attribute.name,
                                                    value: attr.attribute_value
                                                }

                                                rows.push(row)

                                                return row
                                            })
                                            
                                        setRows((data) => ({ ...data, building: attributes }))
                                    }
                                }
                            }
                        })

                        childrenObjects.forEach(item => {
                            const finedObject  = objects.find(ob => ob.id == item.id)

                            if (obj.showClassName) {
                                rows.push({
                                    name: finedObject.class.name,
                                    value: finedObject.name
                                })

                                if (obj?.attributeIds?.length > 0) {
                                    finedObject.object_attributes
                                        .filter(attr => obj.attributeIds
                                            .includes(attr.attribute_id))
                                        .map(attr => {
                                            rows.push({
                                                name: attr.attribute.name,
                                                value: attr.attribute_value
                                            })
                                        })
                                }
                            }
                        })

                    })
                }
                
                setDataSource(rows.map((row, idx) => {
                    return {
                        ...row,
                        key: row?.name + ' - ' + idx
                    }
                }))
            }
        }
    }, [attributesIds, objectId, objects, attributeCategory, showLinks, linkedObjects])

    const hanleClose = () => {
        setIsModalVisible(false)
        setRightObjectId(undefined)
    }

    console.log('Датасорс', dataSource)
    const createComponent = () => {
        switch (displayType) {
            case 'table': {
                return (
                    <SimpleTable
                        rows={dataSource}
                        columns={columns}
                        showHeader={false}
                        pagination={false}
                        locale={{ emptyText: 'Нет данных' }}
                        size="small"
                    />
                )
            }
                
            case 'strings':
                return (
                    <>
                        {dataSource.map((item, idx) => {
                            return (
                                
                                <Col
                                    style={{ textAlign: 'left', marginBottom: '10px' }}
                                    key={item?.key + '-' + idx}
                                >
                                    <div /* style={{ textDecoration: 'underline' }} */>
                                        {item.name}:
                                    </div>
                                    <div>
                                        {item.value}
                                    </div>
                                </Col>

                            )
                        })}
                    </>
                )
            default:
                return <> </>
        }
    }

    return (
        <>
            <ObjectCardModal 
                objectId={rightObjectId} 
                modal={{ 
                    open: isModalVisible, 
                    onCancel: hanleClose,
                    destroyOnClose: true
                }} 
            />

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
                {!divided && createComponent()}
                {divided && rows.building.length > 0 && (
                    <Row>
                        <Col>
                            <Typography.Title level={5} style={{ marginTop: 8 }}>
                                Атрибуты здания
                            </Typography.Title>
                        </Col>
                        <Col>
                            <SimpleTable
                                rows={rows.building}
                                columns={columns}
                                showHeader={false}
                                pagination={false}
                                locale={{ emptyText: 'Нет данных' }}
                                size="small"
                            />
                        </Col>
                    </Row>
                )}
                {divided && rows.building.length > 0 && (
                    <Row>
                        <Col>
                            <Typography.Title level={5}>
                                        Атрибуты услуги
                            </Typography.Title>
                        </Col>
                        <Col>
                            <SimpleTable
                                rows={rows.service}
                                columns={columns}
                                showHeader={false}
                                pagination={false}
                                locale={{ emptyText: 'Нет данных' }}
                                size="small"
                            />
                        </Col>
                    </Row>
                )}
            </Col>
        </>
    )
}

export default ObjectAttributesWidget
import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { SimpleTable } from '@shared/ui/tables'
import { getRelationProps } from '@shared/utils/relations'
import { findChildObjectsWithPaths, findChildObjects_TEST, getObjectName2 } from '@shared/utils/objects'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { IObjectAttribute } from '@shared/types/objects'
import { OAView } from '@entities/objects/OAView/OAView'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'
import { selectAttribute, selectAttributeByIndex, useAttributesStore } from '@shared/stores/attributes'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { getObjectById } from '@shared/api/Objects/Models/getObjectById/getObjectById'

/**
 * Свойства объекта
 
 * @param {number} attributeCategory - Выбор категории атрибутов, которые необходимо выводить(при необходимости)
 * @param {number[]} attributesIds - Айди атрибутов, которые показываем(при необходимости)
 * @param {number} objectId - Айди объекта
 * @param {number} height - Высота виджета, применяется для скрола 
 * @param {boolean} showLinks- Параметр, отвечающий за вывод связей(при необходимости)
 * @param {'table'| 'strings'} displayType - Параметр, отвечающий за формат вывода(таблица или полоски)
 * @param linkedObjects - параметр, который отвечает за вывод связанных объектов
 * @param {boolean} linked - Параметр, отвечающий за вывод Дивидера
 * @param {number[]} oaSortOrder - Сортировка выводимых атрибутов
 * 
 */

export interface IObjectAttributesWidget {
    attributeCategory?: number
    attributesIds?: number[]
    objectId: number
    height?: number
    showLinks?: boolean
    displayType?: 'table' | 'strings'
    linkedObjects?: {
        targetClasses: {
            class_id: number
            showClassName: boolean
            attributeIds?: number[]
        }[]
        connectingClasses: number[]
    }
    // todo: заменить на массив с подключением нескольких атрибутов [{ id, title }]
    // в данный момент разделяет одну на таблицу на две (услуга и здание)
    divided?: boolean
    oaSortOrder?: number[]
    sorting?: 'label' | 'value' | 'dnd'
    idRow?: {
        show?: boolean
        label?: string
    }
    showObjectName?: boolean
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

const ObjectOAttrs: FC<IObjectAttributesWidget> = ({
    attributeCategory,
    attributesIds,
    objectId,
    height,
    showLinks,
    displayType = 'table',
    divided = false,
    linkedObjects,
    oaSortOrder,
    sorting,
    idRow,
    showObjectName,
}) => {
    const objects = useGetObjects()
    const [dataSource, setDataSource] = useState<{ key: string; value: any; name: string }[]>([])
    const [rows, setRows] = useState({
        building: [] as any[],
        service: [] as any[],
    })
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [rightObjectId, setRightObjectId] = useState<number | undefined>(undefined)

    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    // const attributes = useAttributesStore(selectAttribute)
    const getByIndex = useAttributesStore(selectAttributeByIndex)
    const getAttributeByIndex = useAttributesStore.getState().getByIndex

    // console.log('attributes', attributes)

    // useEffect(() => {

    //     const newAttrs = attributes?.map(attr => ({
    //         ...attr,
    //         attribute: getAttributeByIndex('id', attr.id)
    //     }))

    //     setAttributes(newAttrs)

    // }, [objectId])

    const [object, setObject] = useState(objects?.find((obj) => obj?.id == objectId))

    useEffect(() => {
        if (!object) {
            const fetchData = async () => {
                const resp = await getObjectById(objectId)

                setObject(resp.data)
            }

            fetchData()
        }
    }, [objectId])

    const attributes = useMemo(() => {
        const newAttrs = object?.object_attributes?.map(attr => ({
            ...attr,
            attribute: getAttributeByIndex('id', attr.id)
        }))

        return newAttrs
    }, [object])

    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
        : '#ffffff'

    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
    }, [])

    useEffect(() => {
        setRows(() => ({
            building: [] as any[],
            service: [] as any[],
        }))

        if (objects?.length > 0) {
            // const object = objects?.find((obj) => obj?.id == objectId)

            if (object !== undefined) {
                //* Сортировка атрибутов  по заданным параметрам

                let objectAttributes: any = attributes
                    ?.filter((oa) => ['public', 'private'].includes(oa?.attribute?.visibility))
                    ?.map((oa) => {
                        if (oaSortOrder && oaSortOrder.length > 0) {
                            const idx = oaSortOrder.indexOf(oa.id)

                            return {
                                ...oa,
                                attribute: {
                                    ...oa?.attribute,
                                    sort_order1: idx < 0 ? 10000 + oa?.attribute?.sort_order : idx,
                                },
                            }
                        } else {
                            return oa
                        }
                    })
                    ?.sort((a, b) => {
                        return a?.attribute?.sort_order - b?.attribute?.sort_order
                    })

                //* Если передана категория, фильтруем по ней
                if (attributeCategory !== undefined) {
                    objectAttributes = objectAttributes.filter(
                        (attr) => attr.attribute.attribute_category_id == attributeCategory
                    )
                }

                //* Фильтрация по выбранным ранее атрибутам
                if (attributesIds !== undefined) {
                    // порядок атрибутов как в пропсе массива атрибутов
                    objectAttributes = attributesIds?.reduce((acc, attr) => {
                        const newAttr = objectAttributes?.find((objAttr) => {
                            return objAttr.attribute_id === attr
                        })

                        if (newAttr) {
                            acc.push(newAttr)
                        }

                        return acc
                    }, []) as unknown as IObjectAttribute[]
                }

                if (oaSortOrder && oaSortOrder.length > 0 && sorting == 'dnd') {
                    //*В случае, если атрибут выбран в форме.
                    //* однако oa такого не существует, эммилируем его для корректно работы
                    objectAttributes = oaSortOrder?.map((item) => {
                        return (
                            objectAttributes.find((oa) => oa?.attribute_id == item) ?? {
                                attribute: getByIndex('id', item),
                                attribute_id: getByIndex('id', item)?.id,
                                attribute_value: null,
                                object_id: objectId,
                            }
                        )
                    })
                }

                const rows: any[] = objectAttributes?.map((attr) => {
                    return {
                        name: attr?.attribute?.name,
                        value: <OAView objectAttribute={attr} enableStateText style={{ fontSize: '24px' }} />,
                        key: `attr_${attr?.id}`,
                        sortValue: attr?.attribute_value,
                    }
                })

                // todo: выяснить почему внутри хука мутированный rows2
                const rows2 = rows?.slice()

                if (divided) {
                    // todo: вместе service использовать динамический ключ
                    setRows((data) => ({ ...data, service: rows2 }))
                }

                //*Вывод линков

                if (showLinks) {
                    object.links_where_left.forEach((link) => {
                        if (link.relation.relation_type == 'association') {
                            rows?.push({
                                name: getRelationProps(link.relation).name,
                                value: (
                                    <Typography.Text
                                        style={{
                                            marginRight: '10px',
                                            cursor: 'pointer',
                                            borderBottom: `1px dashed ${textColor}`,
                                            color: textColor,
                                        }}
                                        onClick={() => {
                                            setIsModalVisible(true)
                                            setRightObjectId(link.right_object_id)
                                        }}
                                    >
                                        {getObjectName2(objects.find((obj) => obj?.id == link.right_object_id))}
                                    </Typography.Text>
                                ),
                                key: `link_${link.id}`,
                                sortValue: getObjectName2(objects.find((obj) => obj?.id == link.right_object_id)),
                            })
                        }
                    })
                }

                //*Поиск атрибутов связанных объектов и вывод нужных атрибутов

                if (linkedObjects !== undefined) {
                    linkedObjects.targetClasses?.forEach((obj) => {
                        const childrenObjects = findChildObjectsWithPaths({
                            currentObj: objects.find((item) => objectId == item?.id),
                            childClassIds: [],
                            targetClassIds: [obj.class_id],
                        })?.objectsWithPath

                        const parentObjects = findChildObjects_TEST({
                            object: objects.find((item) => objectId == item?.id),
                            targetClasses: linkedObjects.connectingClasses,
                            objects: objects,
                        })

                        parentObjects.forEach((item) => {
                            const finedObject = objects.find((ob) => ob?.id == item?.id)

                            if (item?.class_id == obj?.class_id) {
                                if (obj.showClassName) {
                                    const row = {
                                        name: finedObject.class.name,
                                        value: finedObject.name,
                                        sortValue: finedObject.name,
                                    }

                                    rows?.push(row)
                                }
                                // if (divided) {
                                //     setRows((data) => ({
                                //         ...data,
                                //         building: [...data.building, row],
                                //     }))
                                // }

                                if (obj.attributeIds?.length > 0) {
                                    const attributes = finedObject.object_attributes
                                        ?.filter((attr) => obj.attributeIds.includes(attr.attribute_id))
                                        ?.map((attr) => {
                                            const row = {
                                                name: attr.attribute.name,
                                                value: attr.attribute_value,
                                                sortValue: attr.attribute_value,
                                            }

                                            rows?.push(row)

                                            return row
                                        })

                                    // setRows((data) => ({ ...data, building: attributes }))
                                }
                            }
                        })

                        childrenObjects.forEach((item) => {
                            const finedObject = objects.find((ob) => ob?.id == item?.id)

                            if (obj.showClassName) {
                                rows?.push({
                                    name: finedObject.class.name,
                                    value: finedObject.name,
                                    sortValue: finedObject.name,
                                })
                            }

                            if (obj?.attributeIds?.length > 0) {
                                finedObject.object_attributes
                                    ?.filter((attr) => obj.attributeIds.includes(attr.attribute_id))
                                    ?.map((attr) => {
                                        rows?.push({
                                            name: attr.attribute.name,
                                            value: <OAView objectAttribute={attr} />,
                                            sortValue: attr.attribute_value,
                                        })
                                    })
                            }
                        })
                    })
                }

                if (showObjectName) {
                    rows?.unshift({
                        value: String(object?.name),
                        name: 'Название объекта',
                        sortValue: String(object?.id),
                    })
                }

                if (idRow?.show) {
                    rows?.unshift({
                        value: String(object?.id),
                        name: idRow?.label ? idRow?.label : 'ID',
                        sortValue: String(object?.id),
                    })
                }

                let finalRows: any[] = rows

                if (sorting) {
                    switch (sorting) {
                        case 'label':
                            finalRows = rows.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
                            break
                        case 'value':
                            finalRows = rows.sort((a, b) =>
                                a.sortValue?.toLowerCase() > b.sortValue?.toLowerCase() ? 1 : -1
                            )
                            break
                    }
                }

                setDataSource(
                    finalRows?.map((row, idx) => {
                        return {
                            ...row,
                            key: row?.name + ' - ' + idx,
                        }
                    })
                )
            }
        }
    }, [attributesIds, objectId, objects, attributeCategory, showLinks, linkedObjects])

    //* Подготовка вывода в зависимости оо выбранного типа
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
                        {dataSource?.map((item, idx) => {
                            return (
                                <Col
                                    style={{
                                        textAlign: 'left',
                                        marginBottom: '10px',
                                        backgroundColor: backgroundColor,
                                    }}
                                    key={item?.key + '-' + idx}
                                >
                                    <div style={{ overflowX: 'hidden', textOverflow: 'ellipsis', color: textColor }}>
                                        {item.name}:
                                    </div>
                                    <div style={{ overflowX: 'hidden', textOverflow: 'ellipsis', color: textColor }}>
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

    const handleClose = () => {
        setIsModalVisible(false)
        setRightObjectId(undefined)
    }

    return (
        <>
            <ObjectCardModal
                objectId={rightObjectId}
                modal={{
                    open: isModalVisible,
                    onCancel: handleClose,
                    destroyOnClose: true,
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
                            overflowY: 'auto',
                            overflowX: clientHeight > Number(height) ? 'clip' : 'auto',
                            textAlign: 'center',
                            color: textColor,
                        }
                        : { height: '100%', padding: '5px', textAlign: 'center', color: textColor }
                }
            >
                {!divided && createComponent()}
                {divided && rows.building.length > 0 && (
                    <Row>
                        <Col>
                            <Typography.Title level={5} style={{ marginTop: 8 }} color={textColor}>
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
                            <Typography.Title level={5} color={textColor}>
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

export default ObjectOAttrs
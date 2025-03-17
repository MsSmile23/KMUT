import { Card, Col, Row, Tabs, TabsProps } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { IObject } from '@shared/types/objects'
import { ILink } from '@shared/types/links'
import { useApi2 } from '@shared/hooks/useApi2'
import { getAttributesViewTypes } from '@shared/api/Attribute/Models/getAttributesViewTypes/getAttributesViewTypes'
import { getAttributeCategories } from '@shared/api/AttributeCategories/Models/getAttributeCategories/getAttributeCategories'
import { IRelation } from '@shared/types/relations'
import { getRelationProps } from '@shared/utils/relations'
import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { getClassFromClassesStore, jsonParseAsObject } from '@shared/utils/common'
import { SimpleTable } from '@shared/ui/tables'
import ObjectCameraWidget from '@containers/objects/ObjectCameraWidget/ObjectCameraWidget'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { LinkedObjectCard } from './LinkedObjectCard'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { RELATION_STEREOTYPE } from '@shared/config/relation_stereotypes'
import { UTILS } from '@shared/utils'
import { getLinks } from '@shared/api/Links/Models/getLinks/getLinks'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { selectObjectAttribute, useObjectAttributesStore } from '@shared/stores/objectAttributes/useObjectAttributesStore'
import { getObjectAttributes } from '@shared/api/ObjectAttributes/Models/getObjectAttributes/getObjectAttributes'
import { useAttributesStore } from '@shared/stores/attributes'

interface IObjectInfoContainer {
    id?: number | string
    objects?: IObject[]
    object: Partial<IObject>
    links?: ILink[]
}

// TODO: Поменять типизацию после пулов
const ObjectInfoContainer: FC<IObjectInfoContainer> = ({ object }) => {
    const viewTypes = useApi2(() => getAttributesViewTypes({ all: true }))
    const attributeCategories = useApi2(() => getAttributeCategories({ all: true }))
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const links = useApi2(() => getLinks({ all: true }))?.data
    // useLinksStore(selectLinks)
    const theme = useTheme()
    const getObjectAttribute = useObjectAttributesStore(selectObjectAttribute)
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    // const attributes = useMemo(() => !object?.object_attributes[0]?.attribute
    // ? getObjectAttribute('object_id', object.id)
    // : object?.object_attributes || [], [object])
    const [attributes, setAttributes] = useState(object?.object_attributes)
    const visibleAttributes = attributes?.filter((attr) => attr?.attribute?.visibility === 'public')
    const getAttributeByIndex = useAttributesStore.getState().getByIndex
    
    useEffect(() => {

        const newAttrs = attributes?.map(attr => ({
            ...attr,
            attribute: getAttributeByIndex('id', attr.id)
        }))

        setAttributes(newAttrs)

    }, [object])

    const [activeKey, setActiveKey] = useState<string>('measurements')
    const attributesWithoutDbCache = visibleAttributes?.filter(({ attribute }) => {
        return !attribute.history_to_db
    })

    const simpleDataTypeAttrs = attributesWithoutDbCache?.filter((attr) => {
        //return [1, 3].includes(attr.attribute.data_type_id)
        return ['integer', 'double', 'string'].includes(attr.attribute.data_type.inner_type)
    })

    const color = createColorForTheme(theme?.textColor, theme?.colors, themeMode)
    const background = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)

    const objectAttributes = {
        withCategories: simpleDataTypeAttrs?.filter((attr) => attr.attribute.attribute_category_id),
        withoutCategories: simpleDataTypeAttrs?.filter((attr) => !attr.attribute.attribute_category_id),
    }
    // категории, которые есть в атрибутах объекта
    const availableCategories = Array.from(
        new Set(simpleDataTypeAttrs?.map((attr) => attr.attribute.attribute_category_id)?.filter(Boolean)).values()
    )

    // таблица Категория
    const categoryRows = objectAttributes.withCategories?.map((oawith) => {
        return {
            key: `obj-attr-with-${oawith.id}`,
            categoryId: oawith.attribute.attribute_category_id,
            name: oawith?.attribute?.name || '---',
            value: oawith.attribute_value,
        }
    })

    const tableViewTypeAttrs = attributesWithoutDbCache?.filter((oa) => oa?.attribute?.view_type_id)

    const availableViewTypes = Array.from(new Set(tableViewTypeAttrs
        ?.map((oa) => oa?.attribute?.view_type_id)).values())

    //  Связанные объекты.
    // Сюда выводим привязанные по link.relation.relation_type association (берём из object.link_where_left)
    const linkedObjectsTabChildren = (object?.links_where_left || [])
        ?.filter((link) => {
            return link?.relation?.relation_type === 'association'
        })
        ?.map((link) => (
            <Col key={`tab-child-linked-obj-${link.id}`} flex="auto">
                <LinkedObjectCard
                    id={link.right_object_id}
                    relationName={link.relation.name}
                    showObjectId={{ enable: true }}
                />
            </Col>
        ))

    const [showHistory, setShowHistory] = useState(false)

    useEffect(() => {
        (async () => {

            const { data = [] } = await UTILS.OA.getOAsForShow(object.object_attributes)

            setShowHistory(data.length > 0)

            if (data.length > 0 == false) {
                setActiveKey('linked-objects')
            }
        })()
    }, [object])

    const measurementLinkedItems: TabsProps['items'] = [
        ...(showHistory
            ? [
                {
                    key: 'measurements',
                    label: <span style={{ color: color }}>Измерения</span>,
                    children: <ObjectOAttrsWithHistory object={object} />,
                },
            ]
            : []),
        {
            key: 'linked-objects',
            label: <span style={{ color: color }}>Связанные объекты</span>,
            disabled: linkedObjectsTabChildren?.length === 0,
            children: <Row gutter={[20, 20]}>{...linkedObjectsTabChildren}</Row>,
        },
    ]

    const compositionLinks = links.filter(
        (link) =>
            link?.relation?.relation_type === 'composition' &&
            link?.right_object_id === object?.id &&
            getClassFromClassesStore(link?.relation.left_class_id)?.package_id === 1
    )

    const linksGroupByRelation = Object.entries(
        compositionLinks.reduce((hash, link) => {
            const id = link.relation_id

            return { ...hash, [id]: hash[id] ? [...hash[id], link] : [link] }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }, {})
    ).map(([_id, links]) => {
        return { relation: links[0].relation, links }
    }) as { relation: IRelation; links: ILink[] }[]

    const compositionItems: TabsProps['items'] = linksGroupByRelation.map(({ relation, links }) => {
        return {
            key: `composition-rel-${relation.id}`,
            label: getRelationProps(relation).name || `Связь [ID ${relation.id}]`,
            children: (
                <Row gutter={[20, 20]}>
                    {links.map((link) => {
                        const object = objects.find((obj) => obj.id === link.left_object_id)

                        if (!object) {
                            return null
                        }

                        const rows = object.object_attributes
                            .filter((attr) => attr.attribute.visibility === 'public')
                            .map((row, i) => ({ key: i, name: row.attribute.name, value: row.attribute_value }))

                        return (
                            <Col key={`composition-link-${link.id}`} flex="auto">
                                <LinkedObjectCard
                                    rows={rows}
                                    title={object.name}
                                    id={object?.id}
                                    showObjectId={{ enable: true }}
                                />
                            </Col>
                        )
                    })}
                </Row>
            ),
        }
    })

    return (
        <Row gutter={[8, 8]} style={{ marginTop: '20px', background: background ?? 'auto' }}>
            {(object?.links_where_left || [])
                .filter((link) => {
                    return link.relation?.relation_stereotype?.mnemo === RELATION_STEREOTYPE.probe_template
                })
                .map((link) => (
                    <Col flex="auto" key={`probe-template-link-${link.id}`}>
                        <Card style={{ background: background ?? 'auto' }} title="Шаблон измерений">
                            <ObjectOAttrs
                                objectId={link.right_object_id}
                                attributesIds={simpleDataTypeAttrs.map((oa) => oa.attribute_id)}
                                idRow={{ show: true, label: 'ID объекта' }}
                            />
                        </Card>
                    </Col>
                ))}
            {attributeCategories.data
                .filter((attrCat) => {
                    return availableCategories.includes(attrCat.id)
                })
                .map((attrCat) => {
                    const rows = categoryRows.filter((row) => row.categoryId === attrCat.id)

                    if (rows.length === 0) {
                        return null
                    }

                    return (
                        <Col flex="auto" key={`attr-cat-${attrCat.id}`}>
                            <Card
                                style={{ background: background ?? 'auto' }}
                                title={
                                    <span style={{ color: color }}>
                                        {`Атрибуты объекта категории "${attrCat.name}"`}
                                    </span>
                                }
                            >
                                <ObjectOAttrs
                                    objectId={object?.id}
                                    attributeCategory={attrCat.id}
                                    idRow={{ show: true, label: 'ID объекта' }}
                                // attributesIds={objectAttributes.withoutCategories.map((oa) => oa.id)}
                                />
                                {/* <Table
                                dataSource={categoryRows.filter((row) => row.categoryId === attrCat.id)}
                                columns={columns}
                                pagination={false}
                                showHeader={false}
                            /> */}
                            </Card>
                        </Col>
                    )
                })}
            {/* {objectsAttributesRows.length > 0 && (
                <Col>
                    <Card  style={{backgorund: background ?? 'auto'}} title="Атрибуты объекта">
                        <Table
                            dataSource={objectsAttributesRows}
                            columns={columns}
                            pagination={false}
                            showHeader={false}
                        />
                    </Card>
                </Col>
            )} */}
            <Col flex="auto">
                <Card
                    style={{ background: background ?? 'auto' }}
                    headStyle={{ background: background ?? 'auto' }}
                    bodyStyle={{ background: background ?? 'auto' }}
                    title={<span style={{ color: color }}>Атрибуты объекта без категории</span>}
                >
                    <ObjectOAttrs
                        objectId={object?.id}
                        attributesIds={simpleDataTypeAttrs?.map((oa) => oa.attribute_id)}
                        idRow={{ show: true, label: 'ID объекта' }}
                    />
                </Card>
            </Col>
            {object?.class_id == 10108 && (
                <Col flex="auto">
                    <WrapperWidget title="Камера">
                        <ObjectCameraWidget url="/video/stream1/index.m3u8" />
                    </WrapperWidget>
                </Col>
            )}
            {viewTypes.data
                .filter((vt) => {
                    return vt.type === 'table' && availableViewTypes.includes(vt.id)
                })
                .map((vt) => {
                    let params: unknown = vt.params

                    if (typeof params === 'string') {
                        try {
                            params = JSON.parse(vt.params)
                        } catch {
                            params = { headers: ['Название', 'Значение'] }
                        }
                    }

                    const columns = (params as { headers: string[] }).headers.map((h: string, i: number) => ({
                        key: `hcol${i}`,
                        dataIndex: i,
                        title: h,
                    }))

                    const tables = tableViewTypeAttrs
                        .filter((ta) => ta.attribute.view_type_id === vt.id)
                        .map((oa) => {
                            const jsonValue = jsonParseAsObject(oa.attribute_value) ?? {}
                            const newRows: any[] = []

                            Object.entries(jsonValue).map((row) => {
                                const newRow: any[] = []

                                columns.forEach((column, index) => {
                                    if (row?.[1]?.[index]) {
                                        newRow.push(row?.[1]?.[index])

                                        return
                                    }
                                    newRow.push('-')
                                })
                                newRow.push(row[0])
                                newRows.push(newRow)
                            })

                            return { attribute: oa, rows: newRows }
                        })

                    return tables.map((table) => (
                        <Col key={`view-type-table-${vt.id}_${Math.random()}`} flex="auto">
                            <Card style={{ background: background ?? 'auto' }} title={table.attribute.attribute.name}>
                                <SimpleTable
                                    rows={[]}
                                    columns={columns}
                                    dataSource={table.rows}
                                    pagination={false}
                                    showHeader={true}
                                    rowKey={(record) => record?.[columns.length] ?? Math.random()}
                                    scroll={{ y: 200 }}
                                />
                            </Card>
                        </Col>
                    ))
                })}

            <Col xs={24}>
                <Tabs
                    style={{ background: background ?? 'auto' }}
                    defaultActiveKey="composition"
                    items={compositionItems}
                />
            </Col>
            <Col xs={24}>
                <Tabs
                    style={{ background: background ?? 'auto' }}
                    activeKey={activeKey}
                    items={measurementLinkedItems}
                    onChange={(activeKey: string) => setActiveKey(activeKey)}
                />
            </Col>
        </Row>
    )
}

export default ObjectInfoContainer
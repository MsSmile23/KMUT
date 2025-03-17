/* eslint-disable react/jsx-no-useless-fragment */
import { FC, useEffect, useState } from 'react'
import { TWidgetSettings } from '../widget-types'
import { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'
import { IColumns } from './ColumnsConstructor'
import { findChildObjectsByBaseClasses } from '@shared/utils/objects'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { Col, Row } from 'antd'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { OAView } from '@entities/objects/OAView/OAView'
import { IObjectAttribute } from '@shared/types/objects'
import { FaEthernet } from 'react-icons/fa6'
import { useGetObjects } from '@shared/hooks/useGetObjects'

interface IWidgetInterfacesTable {
    linkedObjectsForm?: ILinkedObjectsForm
    chosenColumns: IColumns[]
    cableClasses?: any[]
    portClasses?: any[]
    deviceClasses?: any[]
}

const WidgetInterfacesTable: FC<TWidgetSettings<IWidgetInterfacesTable>> = (props) => {
    const { settings } = props
    const { widget } = settings
    const { linkedObjectsForm, chosenColumns, deviceClasses, portClasses, cableClasses } = widget
    const [columns, setColumns] = useState<any[]>([])
    const [rows, setRows] = useState<any[]>([])
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    const ICONS = {
        // 10264: <DeleteOutlined style={{ color: '#FFC700' }} />,
        // 10265: <DeleteOutlined style={{ color: '#FFC700' }} />,
        10065: (
            <FaEthernet
                style={{
                    color: '#FF9900',
                    border: '2px solid #FF9900',
                    borderRadius: '4px',
                    fontSize: '20px',
                    padding: '1px',
                    marginRight: '5px',
                }}
            />
        ),
        10063: (
            <FaEthernet
                style={{
                    color: '#FFC700',
                    border: '2px solid #FFC700',
                    borderRadius: '4px',
                    fontSize: '20px',
                    padding: '1px',
                    transform: 'rotate(180deg)',
                    marginRight: '5px',
                }}
            />
        ),
    }

    const createRepresentation = (representation, item: IObjectAttribute) => {
        let result: any

        switch (representation) {
            case 'usual':
                result = <OAView objectAttribute={item} />
                break
            case 'iconAndText':
                result = (
                    <>
                        {ICONS[item.attribute_id]} {item.attribute_value}
                    </>
                )
                break
        }

        return result
    }

    useEffect(() => {
        const localColumns = []

        if (chosenColumns) {
            chosenColumns.forEach((item, index) => {
                localColumns.push({
                    title: item.name,
                    dataIndex: `column_${index}`,
                })
            })
            localColumns.unshift({ title: 'Подключенное устройство', dataIndex: 'connectedDevice' })
            localColumns.unshift({ title: 'ID', dataIndex: 'id' })
            setColumns(localColumns)
        }
    }, [chosenColumns])

    useEffect(() => {
        const localRows: any[] = []

        if (linkedObjectsForm) {
            const objectsIdsArray = findChildObjectsByBaseClasses({
                childClassIds: [],
                targetClassIds: linkedObjectsForm?.targetClasses ?? [],
                currentObj: objects.find((obj) => obj.id == settings?.vtemplate?.objectId),
            })

            objectsIdsArray.forEach((obj) => {
                const object = objects.find((object) => obj == object.id)
                const row: any = {}

                if (deviceClasses) {
                    let cable

                    const objLinks = [...object.links_where_left, ...object.links_where_right]

                    objLinks.forEach((item) => {
                        if (cableClasses.includes(item.relation.left_class_id)) {
                            cable = objects.find((ob) => ob.id == item.left_object_id)
                        }

                        if (cableClasses.includes(item.relation.right_class_id)) {
                            cable = objects.find((ob) => ob.id == item.right_object_id)
                        }
                    })

                    let port2
                    const cableLinks = cable ? [...cable.links_where_left] : []

                    cableLinks?.forEach((cab) => {
                        if (cab?.right_object_id !== object?.id) {
                            port2 = objects?.find((ob) => ob?.id == cab?.right_object_id)
                        }
                    })

                    let connectedDevice
                    const port2Links = port2 ? [...port2.links_where_left, ...port2.links_where_right] : []

                    port2Links.forEach((pr) => {
                        if (
                            deviceClasses.includes(pr.relation.left_class_id) &&
                            portClasses.includes(pr.relation.right_class_id)
                        ) {
                            connectedDevice = objects.find((ob) => ob.id == pr.left_object_id)
                        }

                        if (
                            deviceClasses.includes(pr.relation.right_class_id) &&
                            portClasses.includes(pr.relation.left_class_id)
                        ) {
                            connectedDevice = objects.find((ob) => ob.id == pr.right_object_id)
                        }
                    })
                    row.connectedDevice = connectedDevice
                        ? `[${connectedDevice?.id}]${connectedDevice?.name}`
                        : 'Нет подключенного устройства'
                }
                row.id = obj
                row.key = obj
                chosenColumns.forEach((column, index) => {
                    if (column.type == 'attribute') {
                        const objAttr = object.object_attributes.find((attr) => attr.attribute_id == column.typeValue)
                        const value = createRepresentation(column.representation, objAttr)

                        row[`column_${index}`] = value
                    } else {
                        let result

                        switch (column.typeValue) {
                            case 'class':
                                if (column.representation == 'iconAndText') {
                                    result = (
                                        <>
                                            {object.class.icon ? (
                                                <>
                                                    <ECIconView icon={object.class.icon} /> {object.class.name}
                                                </>
                                            ) : (
                                                <Row align="middle">
                                                    {ICONS[object.class_id]} {object.class.name}
                                                </Row>
                                            )}
                                        </>
                                    )
                                }

                                if (column.representation == 'usual') {
                                    result = <>{object.class.name}</>
                                }
                                break

                            case 'name':
                                if (column.representation == 'iconAndText') {
                                    result = (
                                        <>
                                            {object.class.icon ? (
                                                <>
                                                    <ECIconView icon={object.class.icon} /> {object.name}
                                                </>
                                            ) : (
                                                <>{object.name}</>
                                            )}
                                        </>
                                    )
                                }

                                if (column.representation == 'usual') {
                                    result = <>{object.class.name}</>
                                }
                                break
                        }

                        row[`column_${index}`] = result
                    }
                })

                localRows.push(row)
            })
        }
        setRows(localRows)
    }, [linkedObjectsForm, chosenColumns])

    return (
        <Col span={24}>
            <EditTable
                tableId="interfaces-table"
                rows={rows}
                columns={columns.map( item => ({ ...item, key: item.dataIndex }) )}
                // pagination={{ position: ['bottomRight'], pageSize: 10 }}
                paginator={{ page: 1, pageSize: 10, enablePageSelector: false }}
                scroll={{ x: 'auto' }}
            />
        </Col>
    )
}

export default WidgetInterfacesTable
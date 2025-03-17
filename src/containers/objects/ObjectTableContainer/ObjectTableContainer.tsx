import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Row, Col, message } from 'antd'
import { ButtonEditRow, ButtonCreatable } from '@shared/ui/buttons'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { IObject } from '@shared/types/objects'
import { IAttribute } from '@shared/types/attributes'
import { deleteObjectById } from '@shared/api/Objects/Models/deleteObjectById/deleteObjectById'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { ATTR_STEREOTYPE } from '@shared/config/attr_stereotypes'
import { getURL } from '@shared/utils/nav'
import { IInterfaceView, generalStore } from '@shared/stores/general'
import ObjectButtonRowDelete from '@entities/objects/ObjectButtonRowDelete/ObjectButtonRowDelete'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { OAView } from '@entities/objects/OAView/OAView'
import { getObjects } from '@shared/api/Objects/Models/getObjects/getObjects'
import { useApi2 } from '@shared/hooks/useApi2'

const ObjectTableContainer = () => {
    // const storeObjects = useObjectsStore(selectObjects)
    const storeObjects = useGetObjects()
    const storeAttributes = useAttributesStore(selectAttributes)
    const interfaceView = generalStore(st => st.interfaceView)
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const [searchParams] = useSearchParams()
    const classId = Number(searchParams.get('class_id'))
    const [objects, setObjects] = useState<IObject[]>(storeObjects.filter((object) => object.class_id === classId))
    // const [objects, setObjects] = useState<IObject[]>([])
    const [tableLoading, setTableLoading] = useState(false)

    const navigate = useNavigate()

    const newObjects = useApi2(
        (payload?: any) => getObjects((payload || {})),
        {
            onmount: false,
        },
    )

    useEffect(() => {
        const storeObject = storeObjects.filter((object) => object.class_id === classId)

        if (storeObject?.length < 1) {
            newObjects.request({
                'filter[class_id]': classId,
            })
            
            return
        }

        setObjects(storeObject)

        return () => setObjects([])

    }, [classId])

    useEffect(() => {

        setAttributes(storeAttributes.filter((item) => {
            return item.classes_ids.find((clas) => clas?.id === classId) && item.visibility == 'public'
        }))

    }, [classId])

    const columns = useMemo(() => {
        const nameColumns = [
            {
                title: 'ID объекта',
                dataIndex: 'objectId',
                key: 'objectId',
                width: 140,
            },
            {
                title: 'Наименование',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Код',
                dataIndex: 'codename',
                key: 'codename',
            },
            {
                title: 'Класс',
                dataIndex: 'className',
                key: 'className',
            },

        ]

        const attributesColumns = attributes.map((attribute) => ({
            title: attribute.name,
            dataIndex: attribute.id,
            key: attribute.id,
        }))

        return [
            {
                title: 'Действия',
                dataIndex: 'actions',
                key: 'actions',
                width: 100,
            },
            ...nameColumns,
            ...attributesColumns,
        ]
    }, [attributes])

    const deleteObject = async (id: number) => {
        setTableLoading(true)

        try {
            const response = await deleteObjectById(id)

            if (response.success && response.data.statusText === 'Deleted') {

                if (objects.length > 0) {
                    setObjects((objs) => objs.filter((obj) => obj.id !== id))
                } else {
                    newObjects.request()
                }

            } else {
                throw Error
            }

            return response

        } catch {
            message.error('Не удалось удалить объект')
        } finally {
            setTableLoading(false)
        }
    }

    const tableRowData = useMemo(() => {
        return (objects.length > 0 ? objects : newObjects?.data)?.map((object: IObject) => {
            const objectAttributes = {}

            columns.forEach((column) => {
                const match = object?.object_attributes?.find((item) => item?.attribute_id === column?.key)

                if (match) {

                    //TODO захардкожено
                    objectAttributes[column.key] = match?.attribute?.data_type_id == 4
                        ? (match?.attribute_value == '1' ? '✔' : '×')
                        : match.attribute?.attribute_stereotype?.mnemo === ATTR_STEREOTYPE.building_circuit
                            ? 'Контур здания'
                            : <OAView objectAttribute={match} />
                            // : <></>

                    // jsonCheck ? <OAJSONShortView value={match.attribute_value} /> : match.attribute_value
                }
            })



            return {
                key: object?.id,
                objectId: object?.id,
                name: object?.name,
                codename: object?.codename,
                className: object?.class?.name,
                ...objectAttributes,
                actions: (
                    <Row gutter={8}>
                        <Col>
                            <ButtonEditRow
                                onClick={() => {
                                    navigate(getURL(
                                        `${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/${object.id}?class_id=${classId}`,
                                        interfaceView as Exclude<IInterfaceView, ''>
                                        // interfaceView === 'showcase' ? 'showcase' : 'manager'
                                    ))
                                    // navigate(
                                    //     `/${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/${object.id}?class_id=${classId}`
                                    // )
                                }}
                            />
                        </Col>
                        <Col>
                            {/* <ButtonDeleteRow
                                disabled={!object.id}
                                withConfirm
                                // disablePopup={true}
                                onClick={() => deleteObject(object.id)}
                            /> */}
                            <ObjectButtonRowDelete
                                withConfirm
                                onClick={async () => {
                                    const response = await deleteObject(object.id)

                                    return response
                                }}
                                disablePopup={true}
                            />
                        </Col>
                    </Row>
                ),
            }
        })
    }, [newObjects?.data, objects])

    return (
        <div>
            <EditTable
                rows={tableRowData.map((row) => ({
                    ...row,
                    key: `${row.key}`,
                }))}
                columns={columns.map((col) => ({ ...col, key: `${col.dataIndex}`, dataIndex: `${col.dataIndex}`, }))}
                scroll={{
                    x: columns.reduce((total, col) => total + col?.title?.length * 20, 0),
                    y: 580
                }}
                loading={newObjects.loading || tableLoading}
                enablePagination={objects.length < 1 ? true : false}
                paginator={objects.length < 1 && {
                    page: Number(newObjects.pagination.currentPage || 1),
                    pageSize: 10,
                    total: Number(newObjects.pagination.total),
                    enablePageSelector: true,
                }}
                server={objects.length < 1 && {
                    request: async ({ filterValue, ...meta }) => {
                        const payload = {
                            ...meta,
                            'filter[class_id]': classId,
                        }

                        return newObjects.request(payload)
                    },
                    filter: async (config) => {
                        const payload = {
                            ...config,
                            per_page: config?.pageSize,
                            'filter[class_id]': classId,
                        }

                        delete payload?.pageSize
                        delete payload?.value

                        return newObjects.request(payload)
                    }
                }}
                buttons={{
                    left: [
                        <ButtonCreatable
                            key="btn-add"
                            shape="circle"
                            text={false}
                            entity="objects"
                            buttonAdd={true}
                            onClick={() => {
                                navigate(getURL(
                                    `${ROUTES.OBJECTS}/${ROUTES_COMMON.CREATE}?class_id=${classId}`,
                                    'manager'
                                ))
                                // navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.CREATE}?class_id=${classId}`)
                            }}
                        />
                    ]
                }}
            />
        </div>
    )
}

export default ObjectTableContainer
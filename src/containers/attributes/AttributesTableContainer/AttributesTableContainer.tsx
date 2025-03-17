import {
    ButtonDeleteRow,
    ButtonEditRow,
    ButtonCreatable
} from '@shared/ui/buttons'
import { attributesTableColumns, visibilityTranslation } from './AttributesTableData'
import { Col, Divider, Form, Modal, Popconfirm, Row, Space } from 'antd'
import AttributesFormContainer from '../AttributesFormContainer/AttributesFormContainer'
import { useOpen } from '@shared/hooks/useOpen'
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { useEffect, useState, FC, useMemo } from 'react'
import { deleteAttributeById } from '@shared/api/Attribute/Models/deleteAttributeById/deleteAttributeById'
import { useNavigate } from 'react-router'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useAttributesStore } from '@shared/stores/attributes'
import { useAttributeCategoryStore2 } from '@shared/stores/attributeCategories'
import { getURL } from '@shared/utils/nav'
import { responseErrorHandler } from '@shared/utils/common'
import { ECTable2 } from '@shared/ui/tables/ECTable2/ECTable2'
import { selectDataType, useDataTypes } from '@shared/stores/dataTypes'

interface IAttributesTableContainerProps {
    tableScroll: {
        x: number
        y: number
    },
    isPagination?: boolean
}

const AttributesTableContainer: FC<IAttributesTableContainerProps> = ({
    tableScroll,
    isPagination = true
}) => {

    const modal = useOpen()
    const open = modal.open
    const { forceUpdate: forceUpdateAttrsStore } = useAttributesStore.getState()
    const [ form ] = Form.useForm()
    const [ editedId, setEditedId ] = useState(0)
    const navigate = useNavigate()

    const attributes = useAttributesStore((st) => st.store.data)
    const categories = useAttributeCategoryStore2((st) => st.store.data)
    const getDataTypeById = useDataTypes(selectDataType)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ selected, setSelected ] = useState({
        keys: [] as React.Key[],
        rows: [] as any[]
    })

    // TODO: типизировать ряды
    const rows: any[] = useMemo(() => [...attributes].sort((a, b) => b.id - a.id).map((attr) => {
        return {
            key: `attr-row-${attr.id}`,
            id: attr.id,
            name: attr.name,
            visibility: visibilityTranslation[attr.visibility],
            visibilityFilterValue: attr.visibility,
            multiplicity: `${attr.multiplicity_left ?? '-'} / ${attr.multiplicity_right || '*'}`,
            dataType: getDataTypeById( attr?.data_type_id)?.name,
            initialValue: attr.initial_value || '---',
            attributeCategory: categories.find((cat) => attr.attribute_category_id === cat.id)?.name,
            categoryFilterValue: attr.attribute_category_id,
            historyToDb: attr.history_to_db ? '+' : '-',
            historyToDbFilterValue: attr.history_to_db,
            historyToCache: attr.history_to_cache ? '+' : '-',
            historyToCacheFilterValue: attr.history_to_cache,
            readonly: attr.readonly ? '+' : '-',
            readonlyFilterValue: attr.readonly,
            actions: (
                <Space>
                    <ButtonEditRow
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.UPDATE}/${attr?.id}`, 
                                'constructor'
                            ))
                            // navigate(`/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.UPDATE}/${attr?.id}`)
                        }}
                    />
                    <Popconfirm
                        title="Удаление"
                        description={`Удалить ${attr.name}?`}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => {
                            deleteAttributeById(`${attr.id}`).then((resp) => {

                                if (resp.success) {
                                    forceUpdateAttrsStore()

                                    Modal.success({
                                        title: '',
                                        content: 'Атрибут успешно удален',
                                    })
                                } else {
                                    responseErrorHandler({
                                        response: resp,
                                        modal: Modal,
                                        errorText: 'Ошибка удаления атрибута',
                                    })
                                }
                                //attributes.request()
                            })
                        }}
                    >
                        <ButtonDeleteRow />
                    </Popconfirm>
                </Space>
            ),

        }
    }), [attributes] )

    useEffect(() => {
        if (editedId) {
            open()
        }
    }, [editedId, open])

    return (
        <>
            {/* <EditTable 
                tableId="attributesList"
                style={{ maxWidth: '100%' }}
                columns={attributesTableColumns.map((col) => ({
                    ...col,
                    ...(col?.key === 'attributeCategory' ? ({
                        filterType: 'select',
                        filterSelectOptions: categories.map((pack) => ({ value: pack.id, label: pack.name }))
                    }) : {}),
                }))}
                rows={rows}
                rowSelection={{
                    onChange: (keys, rows) => setSelected({ keys, rows }),
                    columnWidth: 30
                }}
                buttons={{
                    left: [
                        <ButtonCreatable 
                            key="button-add-attribute"
                            shape="circle"
                            text={false}
                            entity="attributes"
                            buttonAdd={true}
                            onClick={() => { 
                                navigate(getURL(
                                    `${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.CREATE}`, 
                                    'constructor'
                                ))
                                // navigate(`/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.CREATE}`)
                            }}
                        />
                    ]
                }}
                scroll={{ y: tableScroll.y, x: tableScroll.x }}
                pagination={isPagination
                    ? { position: ['bottomRight'], pageSize: 15 }
                    : false}
            /> */}
            <ECTable2
                agTable={false}
                tableId="attributesList"
                style={{ maxWidth: '100%', height: '700px' }}
                columns={attributesTableColumns.map((col) => ({
                    ...col,
                    ...(col?.key === 'attributeCategory' ? ({
                        filterType: 'select',
                        filterSelectOptions: categories.map((pack) => ({ value: pack.id, label: pack.name }))
                    }) : {}),
                }))}
                rowSelection={{
                    onChange: (keys, rows) => setSelected({ keys, rows }),
                    columnWidth: 30
                }}
                buttons={{
                    left: [
                        <ButtonCreatable 
                            key="button-add-attribute"
                            shape="circle"
                            text={false}
                            entity="attributes"
                            buttonAdd={true}
                            onClick={() => { 
                                navigate(getURL(
                                    `${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.CREATE}`, 
                                    'constructor'
                                ))
                                // navigate(`/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.CREATE}`)
                            }}
                        />
                    ]
                }}
                rows={rows}
                scroll={{ y: tableScroll.y, x: tableScroll.x }}
                pagination={isPagination
                    ? { position: ['bottomRight'], pageSize: 15 }
                    : false}
                switchGrid={true}
                changeAction={false}
                paginAdditional={{ button: false, suppress: false, newPagin: false }}
                changeColumns={true}
            />

            <DefaultModal2
                title={editedId ? 'Редактирование атрибута' : 'Создание атрибута'}
                open={modal.isOpen}
                onCancel={() => {
                    modal.close()
                    setEditedId(0)
                    form?.resetFields()
                }}
                destroyOnClose
                footer={null}
                width="90vw"
            >
                <Row gutter={[0, 12]}>
                    <Col xs={24}>
                        <Divider style={{ margin: 0 }} />
                    </Col>
                    <Col xs={24}>
                        <AttributesFormContainer form={form} id={editedId} />
                    </Col>
                </Row>
            </DefaultModal2>
        </>

    )
}

export default AttributesTableContainer
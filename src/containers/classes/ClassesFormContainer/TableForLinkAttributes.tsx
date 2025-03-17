import { FC, useEffect, useLayoutEffect, useState } from 'react'
import { FORM_NAMES, columns } from './data'
import { Col, Form, Input, Modal, Row } from 'antd'
import { SimpleTable } from '@shared/ui/tables'
import { SERVICES_ATTRIBUTES } from '@shared/api/Attribute'
import { ButtonAdd, ButtonCancel, ButtonDeleteRow, ButtonEditRow, ButtonUnlink } from '@shared/ui/buttons'
import ModalForLinkAttributes from './ModalForLinkAttributes'
import ModalAddAttribute from './ModalAddAttribute'
import { useOpen } from '@shared/hooks/useOpen'
import { VISIBILITY } from '@shared/config/const'
import { deleteAttributeById } from '@shared/api/Attribute/Models/deleteAttributeById/deleteAttributeById'
import { IAttribute } from '@shared/types/attributes';
import { selectDataTypes, useDataTypes } from '@shared/stores/dataTypes'
import OAttrFormField from '@entities/object-attributes/OAttrFormField/OAttrFormField'
import OAShortFieldView from '@entities/object-attributes/OAShortFieldView/OAShortFieldView'

const OATTR_MNEMO_IMAGE = 'uploaded_image'

interface ITableForLinkAttributes {
    classId: string
    linkedAttributes: IAttribute[]
    setLinkedAttributes: any,
    form: any,
}

const TableForLinkAttributes: FC<ITableForLinkAttributes> = ({
    classId,
    linkedAttributes,
    setLinkedAttributes,
    form }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [modalSelectedRowKeys, setModalSelectedRowKeys] = useState<React.Key[]>([])
    const [attributes, setAttributes] = useState<any[]>([])
    const modal = useOpen()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [attributesForModal, setAttributesForModal] = useState<any[]>([])
    const [rows, setRows] = useState<any[]>([])
    const [attrEditId, setAttrEditId] = useState<number | undefined>(undefined)
    const [loadingTable, setLoadingTable] = useState<boolean>(false)
    const dataTypes = useDataTypes(selectDataTypes)
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const onModalSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setModalSelectedRowKeys(newSelectedRowKeys)
    }

    const [rowSelection, setModalSelection] = useState({
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: false,
    })
    const [modalRowSelection, setModalRowSelection] = useState({
        selectedRowKeys: modalSelectedRowKeys,
        onChange: onModalSelectChange,
        preserveSelectedRowKeys: false,
    })

    useLayoutEffect(() => {setLoadingTable(true)}, [])

    useEffect(() => {
        setModalSelection({
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            preserveSelectedRowKeys: false,
        })
    }, [selectedRowKeys])
    useEffect(() => {
        setModalRowSelection({
            selectedRowKeys: modalSelectedRowKeys,
            onChange: onModalSelectChange,
            preserveSelectedRowKeys: false,
        })
    }, [modalSelectedRowKeys])

    const handleModalSubmit = () => {
        const selectedModalAttributesIds: number[] = []

        modalSelectedRowKeys.forEach((item: string) => {
            const id = item.split('modal_attribute_')[1]

            selectedModalAttributesIds.push(parseInt(id, 10))
        })

        const newAttributes = attributes.filter((attr) => selectedModalAttributesIds.includes(attr?.id))

        setLinkedAttributes([...linkedAttributes, ...newAttributes])
        const attributesForModal = [...linkedAttributes, ...newAttributes].map((item) => {
            return item.id
        })

        setAttributesForModal(attributes.filter((attr) => attributesForModal.includes(attr?.id) == false))
        setModalSelectedRowKeys([])
        setIsModalVisible(false)
    }

    const handleUnbindButton = () => {
        const selectedAttributesForDeleteIds: number[] = []

        selectedRowKeys.forEach((item: string) => {
            const id = item.split('attr_')[1]

            selectedAttributesForDeleteIds.push(parseInt(id, 10))
            const newClassAttributes = linkedAttributes.filter(
                (attr) => selectedAttributesForDeleteIds.includes(attr?.id) == false
            )

            const newClassAttributesIds: number[] = newClassAttributes.map((item) => {
                return item?.id
            })

            setAttributesForModal(attributes.filter((attr) => newClassAttributesIds.includes(attr?.id) == false))

            setLinkedAttributes(newClassAttributes)
        })
        setModalSelectedRowKeys([])
        setSelectedRowKeys([])
    }

    const handleUnbindTableButton  = (id) => {
        const newLinkedAttributes = linkedAttributes.filter(item => item?.id !== id)
        const linkedIds: number[] = newLinkedAttributes.map(attr => {
            return attr?.id
        })

        setAttributesForModal(attributes.filter((attr) => linkedIds.includes(attr?.id) == false))
        setLinkedAttributes(newLinkedAttributes)

    }

    const createStaticAndInitialInput = (attr, formItemName?: string, value?: any, onChange?: any) => {
        const customAttributes = [
            'schedule',
            'wam_processing_rules',
            'multistring',
            'multistring_inline',
            'geo_coordinates_2d',
            'geo_shape',
            'kmut_get_metric',
            'NF_volume',
        ]

        return customAttributes.includes(attr.data_type?.mnemo) || attr?.params?.syntax ? (
            <OAShortFieldView value={value} onChange={onChange} attr={attr} formItemName={formItemName} form={form} />
        ) : (
            <OAttrFormField
                attribute={attr}
                viewTypeId={attr.view_type_id}
                dataType={String(attr.data_type?.inner_type)}
                form={form}
                viewType={attr.view_type?.type}
                formItemName={formItemName}
            />
        )
    }


    useEffect(() => {
        const localRows: any[] = linkedAttributes.map((attr, index) => {

            return {
                key: `attr_key_${index}`,
                id: attr.id,
                name: attr?.name,
                visibility: VISIBILITY[attr.visibility],
                multiplicity: `${attr.multiplicity_left}/${attr.multiplicity_right ?? '*'} `,
                type: attr?.data_type?.name,
                startValue: (
                    <Form.Item
                        style={{ margin: 0 }}
                        name={`attr_initial_value_${attr.id}`}
                        valuePropName={attr.data_type?.inner_type == 'boolean' ? 'checked' : 'value'}
                    >
                        {createStaticAndInitialInput(attr, `attr_initial_value_${attr.id}`)}
                    </Form.Item>
                ),
                staticFuture: (
                    <Form.Item
                        style={{ margin: 0 }}
                        name={`attr_static_feature_${attr.id}`}
                        valuePropName={attr.data_type?.inner_type == 'boolean' ? 'checked' : 'value'}
                        
                    >
                        {createStaticAndInitialInput(attr, `attr_static_feature_${attr.id}`)}
                    </Form.Item>
                ),
                bd: attr?.history_to_db ? '+' : '-',
                cash: attr?.history_to_cache ? '+' : '-',
                readonly: attr?.readonly ? '+' : '-',
                sortOrder: (
                    <Form.Item style={{ margin: 0 }} name={`attr_sort_order_${attr.id}`}>
                        <Input
                            type="number"
                            min={0}
                            max={999}
                            onChange={(e) => {
                                form.setFieldsValue({
                                    [`attr_sort_order_${attr.id}`]: e.target.value,
                                })
                            }}
                        />
                    </Form.Item>
                ),
                actions: (
                    <Row gutter={8}>
                        <Col>
                            <ButtonEditRow
                                onClick={() => {
                                    setAttrEditId(attr?.id)
                                    modal.open()
                                }}
                            />
                        </Col>
                        <Col>
                            <ButtonDeleteRow
                                onClick={() => {
                                    deleteAttributeById(`${attr.id}`).then((resp: any) => {
                                        if (resp.success) {
                                            Modal.info({
                                                content: 'Атрибут успешно удален',
                                            })
                                            setLinkedAttributes(
                                                linkedAttributes.filter((item) => item?.id !== attr?.id)
                                            )
                                        } else {
                                            const error: any[] = []
                                            const chosenErrors = resp.error?.response?.data?.errors

                                            if (chosenErrors !== undefined) {
                                                Object.keys(chosenErrors)?.map((key) => {
                                                    error.push(chosenErrors[key])
                                                })
                                                Modal.warning({
                                                    title: 'Ошибка удаления атрибута',
                                                    content: error[0],
                                                })
                                            } else {
                                                Modal.warning({
                                                    title: 'Ошибка удаления атрибута',
                                                    content: resp.error.response.data.detail,
                                                })
                                            }
                                        }
                                    })
                                }}
                                disabled
                                withConfirm
                                popupTitle="Удалить атрибут? Внимание: будет удалён атрибут, а не привязка!"
                            />
                        </Col>
                        <Col>
                            <ButtonUnlink
                                onClick={() => {
                                    handleUnbindTableButton(attr?.id)
                                }}
                            />
                        </Col>
                    </Row>
                ),
            }
        })

        setRows(localRows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linkedAttributes])

    const addAttributeInTable = (attr) => {
        const newAttr = { ...attr, data_type: dataTypes.find(dt => dt.id == attr.data_type_id) }
        const localAttributes = [...linkedAttributes]

        if (localAttributes.find(at => at.id == attr.id) !== undefined) {
            const index = localAttributes.indexOf(localAttributes.find(at => at.id == attr.id))

            if (index !== -1) {
                localAttributes[index] = newAttr
            }
        }
        else {
            localAttributes.push(newAttr)
        }

        setLinkedAttributes(localAttributes)

    }

    useEffect(() => {

        SERVICES_ATTRIBUTES.Models.getAttributes({ all: true }).then((response) => {
            if (response?.success) {
                if (response?.data !== undefined) {
                    if (form.getFieldValue(FORM_NAMES.PACKAGE) !== undefined) {
                        const linkedAttributesIds: number[] = []
                        const unLinkedAttributes: any[] = []
                        const linkedAttributes: any[] = []
                        const attributes: any[] =
                            response?.data
                                .filter(item => item.package_id == form.getFieldValue(FORM_NAMES.PACKAGE))
                                .map((attr) => {
                                    attr?.classes_ids.forEach((item) => {
                                        if (item?.id == classId) {
                                            linkedAttributesIds.push(attr.id)
                                        }
                                    })

                                    return {
                                        ...attr,
                                        key: `attr_${attr.id}`,
                                    }
                                })

                        attributes.forEach((attribute) => {
                            if (linkedAttributesIds.includes(attribute?.id)) {
                                linkedAttributes.push(attribute)
                            } else {
                                unLinkedAttributes.push(attribute)
                            }
                        })
                        setAttributesForModal(attributes?.filter((item) =>
                            linkedAttributesIds.includes(item?.id) == false))
                        setAttributes(attributes)

                        if (classId !== undefined) {
                            setLinkedAttributes(attributes.filter((item) => linkedAttributesIds.includes(item?.id)))
                        }
                    }
                }
            }

            setLoadingTable(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ form.getFieldValue(FORM_NAMES.PACKAGE), ])



    return (
        <>
            <SimpleTable
                loading={loadingTable}
                pagination={false}
                rowSelection={{ ...rowSelection }}
                columns={columns}
                rows={rows}
                toolbar={{
                    left: null,
                    right: (
                        <Row gutter={5} justify="space-between">
                            <Col>
                                <ButtonAdd
                                    onClick={modal.open}
                                    size="middle"
                                    disabled={form.getFieldValue(FORM_NAMES.PACKAGE) !== undefined ? false : true}
                                    tooltipTitle={
                                        form.getFieldValue(FORM_NAMES.PACKAGE) !== undefined ?
                                            undefined :
                                            'Сначала выберите пакет'
                                    }
                                />
                            </Col>
                            <Col>

                                <ButtonAdd
                                    disabled={form.getFieldValue(FORM_NAMES.PACKAGE) !== undefined ? false : true}
                                    size="middle"
                                    icon={false}
                                    customText="Привязать"
                                    onClick={() => {
                                        setIsModalVisible(true)
                                    }}
                                    tooltipTitle={
                                        form.getFieldValue(FORM_NAMES.PACKAGE) !== undefined ?
                                            undefined :
                                            'Сначала выберите пакет'
                                    }
                                />

                            </Col>
                            <Col>
                                <ButtonCancel
                                    customText="Отвязать"
                                    disabled={selectedRowKeys?.length > 0 ? false : true}
                                    onClick={handleUnbindButton}
                                />
                            </Col>
                        </Row>
                    ),
                }}
            />
            <ModalForLinkAttributes
                handleModalSubmit={handleModalSubmit}
                modalRowSelection={modalRowSelection}
                handleCancel={() => {
                    setIsModalVisible(false)
                    setSelectedRowKeys([])
                }}
                isModalVisible={isModalVisible}
                attributesForModal={attributesForModal}
            />

            <ModalAddAttribute
                editableAttrId={attrEditId}
                modal={modal}
                onSave={(attribute) => {
                    addAttributeInTable(attribute)
                    setAttrEditId(undefined)
                }}
                onCancel={() => {
                    setAttrEditId(undefined)
                }}
            />
        </>
    )
}

export default TableForLinkAttributes
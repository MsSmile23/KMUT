/* eslint-disable react/jsx-max-depth */
import { FC, useEffect, useState } from 'react'
import type { TabsProps } from 'antd'
import { Card, Col, Form, Modal, Row, Tabs, Typography } from 'antd'

import { Forms, Input } from '@shared/ui/forms'
import { ButtonAdd, ButtonCancel, ButtonHelp, Buttons } from '@shared/ui/buttons'
import PackageSelect from '@features/packages/PackageSelect/PackageSelect'
import ClassStereotypesSelect from '@features/class-stereotypes/ClassStereotypesSelect/ClassStereotypesSelect'
import VisibilitySelect from '@features/visibility/VisibilitySelect/VisibilitySelect'
import { columns, FORM_NAMES } from './data'
import { SERVICES_ATTRIBUTES } from '@shared/api/Attribute'
import { SimpleTable } from '@shared/ui/tables'
import ModalForLinkAttributes from './ModalForLinkAttributes'

import { SERVICES_CLASSES } from '@shared/api/Classes'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import ModalAddAttribute from './ModalAddAttribute'
import { useOpen } from '@shared/hooks/useOpen'
import TableForLinkOperations from './TableForLinkOperations'
import { getURL } from '@shared/utils/nav'

interface IClassesFormContainer {
    id?: string
}
const { Text, Title } = Typography
//TODO : Поправить обработку ошибок, чуть универсализизровать и убрать any
const ClassesFormContainer: FC<IClassesFormContainer> = ({ id }) => {
    const [form] = Form.useForm()
    // const [linkedAttributes, setLinkedAttributes] = useState<any[]>([])
    const [attributes, setAttributes] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [modalSelectedRowKeys, setModalSelectedRowKeys] = useState<React.Key[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [attributesForModal, setAttributesForModal] = useState<any[]>([])
    const [linkedAttributes, setLinkedAttributes] = useState<any[]>([])
    const modal = useOpen()
    const [classId, setClassId] = useState<string | undefined>(id)
    const navigate = useNavigate()

    const [linkedOperations, setLinkedOperations] = useState<number[]>([])
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

    Form.useWatch(FORM_NAMES.PACKAGE, form)


    useEffect(() => {
        if (classId !== undefined) {

            SERVICES_CLASSES.Models.getClassById({ id: String(classId) }).then((response) => {
                if (response.success) {
                    if (response?.data !== undefined) {
                        form.setFieldsValue(response?.data)

                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId])

    /*     const closeHandler = () => {
        onClose()
        form.resetFields()
    } */

    useEffect(() => {

        SERVICES_ATTRIBUTES.Models.getAttributes({ all: true }).then((response) => {
            // TODO: Убрать any после пула от Дениса
            if (response?.success) {
                if (response?.data !== undefined) {
                    const linkedAttributesIds: number[] = []
                    const unLinkedAttributes: any[] = []
                    const linkedAttributes: any[] = []
                    const attributes: any[] = response?.data.map((attr) => {
                        attr?.classes_ids.forEach((item) => {
                            if (item?.id == id) {
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
                    setAttributesForModal(attributes?.filter((item) => linkedAttributesIds.includes(item?.id) == false))
                    setAttributes(attributes)

                    if (id !== undefined) {
                        setLinkedAttributes(attributes.filter((item) => linkedAttributesIds.includes(item?.id)))
                    }
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

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

    const onSubmit = async (values: any) => {

        if (classId) {
            const response: any = await SERVICES_CLASSES.Models.postClassById(classId, values)

            if (response.success) {
                const linkedAttributesIds: number[] = linkedAttributes.map((attr) => {
                    return attr?.id
                })

                const responseLinkClassAttrs = await SERVICES_CLASSES.Models.putClassAttributes([
                    {
                        class_id: parseInt(classId, 10),
                        attributes: linkedAttributesIds,
                    },
                ])

                const  responseLinkClassOperations = await SERVICES_CLASSES.Models.putClassOperations([{
                    class_id: parseInt(classId, 10),
                    operations: linkedOperations,
                }])

                if (responseLinkClassAttrs.success &&  responseLinkClassOperations.success ) {
                    Modal.success({
                        content: 'Класс успешно изменен',
                    })
                    navigate(getURL(
                        `${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`, 
                        'constructor'
                    ))
                    // navigate(`/${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`)
                } else {
                    const error: any[] = []
                    const chosenErrors = response.errors.response.data

                    if (chosenErrors !== undefined) {
                        Object.keys(chosenErrors)?.map((key) => {
                            error.push(response.errors[key])
                        })
                        Modal.warning({
                            title: 'Ошибка в привязке атрибутов',
                            content: error[0],
                        })
                    } else {
                        Modal.warning({
                            title: 'Ошибка в привязке атрибутов',
                            content: response.error.response.data.message,
                        })
                    }
                }
            } else {
                const error: any[] = []
                const chosenErrors = response.error?.response?.data?.errors

                if (chosenErrors !== undefined) {
                    Object.keys(chosenErrors)?.map((key) => {
                        error.push(chosenErrors[key])
                    })
                    Modal.warning({
                        title: 'Ошибка редактировании класса',
                        content: error[0],
                    })
                } else {
                    Modal.warning({
                        title: 'Ошибка в редактировании класса',
                        content: response.error.response.data.message,
                    })
                }
            }
        } else {
            const response: any = await SERVICES_CLASSES.Models.postClasses(values)

            if (response.success) {
                const linkedAttributesIds: number[] = linkedAttributes.map((attr) => {
                    return attr?.id
                })
                const data: any = response?.data

                setClassId(data.id)

                const payload: any =  [{ class_id: data?.id, attributes: linkedAttributesIds }]

                const responseLinkClassAttrs: any = await SERVICES_CLASSES.Models.putClassAttributes(payload)

                const  responseLinkClassOperations = await SERVICES_CLASSES.Models.putClassOperations([{
                    class_id: parseInt(data?.id, 10),
                    operations: linkedOperations,
                }])


                if (responseLinkClassAttrs.success &&  responseLinkClassOperations.success) {
                    Modal.success({
                        content: 'Класс успешно создан',
                    })
                    navigate(getURL(
                        `${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`, 
                        'constructor'
                    ))
                    // navigate(`/${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`)
                } else {
                    const error: any[] = []
                    const chosenErrors = responseLinkClassAttrs.error?.response?.data?.errors

                    if (chosenErrors !== undefined) {
                        Object.keys(chosenErrors)?.map((key) => {
                            error.push(chosenErrors[key])
                        })
                        Modal.warning({
                            title: 'Ошибка в привязке атрибутов',
                            content: error[0],
                        })
                    } else {
                        Modal.warning({
                            title: 'Ошибка в привязке атрибутов',
                            content: responseLinkClassAttrs.error.response.data.message,
                        })
                    }
                }
            } else {
                const error: any[] = []
                const chosenErrors = response.error?.response?.data?.errors

                if (chosenErrors !== undefined) {
                    Object.keys(chosenErrors)?.map((key) => {
                        error.push(chosenErrors[key])
                    })
                    Modal.warning({
                        title: 'Ошибка в создании класса',
                        content: error[0],
                    })
                } else {
                    Modal.warning({
                        title: 'Ошибка в создании класса',
                        content: response.error.response.data.message,
                    })
                }
            }
        }
    }

    const tabsItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Атрибуты',
            children: (
                <SimpleTable
                    pagination={false}
                    rowSelection={{ ...rowSelection }}
                    columns={columns}
                    rows={linkedAttributes}
                    toolbar={{
                        left: null,
                        right: (
                            <Row gutter={5} justify="space-between">
                                <Col>
                                    <ButtonAdd onClick={modal.open} size="middle" />
                                </Col>
                                <Col>
                                    <ButtonAdd
                                        size="middle"
                                        icon={false}
                                        customText="Привязать"
                                        onClick={() => {
                                            setIsModalVisible(true)
                                        }}
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
            ),
        },
        {
            key: '2',
            label: 'Связи',
            children:
                 classId ?
                     null :
                     <Title level={3}>Заведение связей доступно только после создания объекта</Title>

        },
        {
            key: '3',
            label: 'Операции',
            children:
             <TableForLinkOperations
                 classId={classId}
                 linkedOperations={linkedOperations}
                 setLinkedOperations={setLinkedOperations}
             />,
        },
    ]

    return (
        <>
            <Card>
                <Col span={12}>
                    <Form labelAlign="left" form={form} onFinish={onSubmit}>
                        <Form.Item labelAlign="left" label="Имя класса" name={FORM_NAMES.NAME} required>
                            <Forms.Input placeholder="Введите имя класса" />
                        </Form.Item>
                        <Row gutter={8}>
                            <Col span={10}>
                                {' '}
                                <VisibilitySelect name={FORM_NAMES.VISIBILITY} required={true} />
                            </Col>
                            <Col span={7}>
                                {' '}
                                <PackageSelect name={FORM_NAMES.PACKAGE} required={true} />
                            </Col>
                            <Col span={7}>
                                <ClassStereotypesSelect
                                    package_id={form.getFieldValue(FORM_NAMES.PACKAGE)}
                                    disabled={form.getFieldValue(FORM_NAMES.PACKAGE) ? false : true}
                                    name={FORM_NAMES.STEREOTYPE}
                                />
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={6}>
                                <Form.Item name={FORM_NAMES.MULTIPLICITY_LEFT} label="Кратность от ">
                                    <Input style={{ width: '100%' }} type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="multiplicity" label="до">
                                    <Input style={{ width: '100%' }} type="number" />
                                </Form.Item>
                            </Col>

                            <Col span={2}>
                                <ButtonHelp
                                    tooltipText={
                                        <>
                                            <Text style={{ color: '#ffffff' }}>
                                                Кратность класса показывает сколько объектов этого класса
                                            </Text>{' '}
                                            <Text style={{ color: '#ffffff' }} strong>
                                                необходимо (от){' '}
                                            </Text>
                                            <Text style={{ color: '#ffffff' }}>создать в системе и сколько</Text>{' '}
                                            <Text style={{ color: '#ffffff' }} strong>
                                                максимально возможно (до)
                                            </Text>
                                        </>
                                    }
                                />
                            </Col>

                            <Col span={3}>
                                <Form.Item colon={false} name={FORM_NAMES.IS_ABSTRACT} valuePropName="checked">
                                    <Forms.CheckBox>Абстрактный</Forms.CheckBox>
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item colon={false} name="has_anonymous_objects" valuePropName="checked">
                                    <Forms.CheckBox>Анонимные объекты</Forms.CheckBox>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <MultiplicitySelect
                                label="Кратность от"
                                name={FORM_NAMES.MULTIPLICITY_LEFT}
                                required={true}
                                placeholder="Выберете кратность"
                                style={{ width: 300 }}
                            />
                            <MultiplicitySelect
                                label="Кратность до"
                                name={FORM_NAMES.MULTIPLICITY_RIGHT}
                                required={true}
                                placeholder="Выберете кратность"
                                style={{ width: 300 }}
                            /> */}

                        <Form.Item>
                            <Buttons.ButtonSubmit htmlType="submit" />
                        </Form.Item>
                    </Form>
                </Col>
            </Card>
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

            <ModalAddAttribute modal={modal} setLinkedAttributes={setLinkedAttributes} />
            <Card style={{ marginTop: '20px' }}>
                {' '}
                <Tabs defaultActiveKey="1" items={tabsItems} />
            </Card>
        </>
    )
}


export default ClassesFormContainer
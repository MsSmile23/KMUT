/* eslint-disable react/jsx-max-depth */
import { FC, useEffect, useMemo, useState } from 'react'
import { Form, Row, Col, Card, Tabs, Space } from 'antd'
import * as Icons from '@ant-design/icons/lib/icons/'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Forms, Input } from '@shared/ui/forms'
import { ButtonHelp } from '@shared/ui/buttons'
import PackageSelect from '@features/packages/PackageSelect/PackageSelect'
import ClassStereotypesSelect from '@features/class-stereotypes/ClassStereotypesSelect/ClassStereotypesSelect'
import VisibilitySelect from '@features/visibility/VisibilitySelect/VisibilitySelect'
import type { TabsProps } from 'antd'
import { SERVICES_CLASSES } from '@shared/api/Classes'
import { useNavigate } from 'react-router-dom'
import { FORM_NAMES } from '../ClassesFormContainer/data'
import TableForLinkOperations from '../ClassesFormContainer/TableForLinkOperations'
import { Typography } from 'antd'
import TableForLinkAttributes from '../ClassesFormContainer/TableForLinkAttributes'
import { saveClass } from '../ClassesFormContainer/utils'
import RelationTableContainer from '@containers/relations/RelationTableContainer/RelationTableContainer';
import { IClass } from '@shared/types/classes'
import { ButtonsFormRow } from '@shared/ui/buttons/ButtonsFormRow/ButtonsFormRow'
import { useClassesStore } from '@shared/stores/classes'
import { useAttributesStore } from '@shared/stores/attributes'

interface IClassesFormContainer {
    id?: string
}

const { Text, Title } = Typography
const ClassesFormContainer2: FC<IClassesFormContainer> = ({ id, ...props }) => {
    const [form] = Form.useForm()
    const [linkedAttributes, setLinkedAttributes] = useState<any[]>([])
    const [classId, setClassId] = useState<string | undefined>(id)
    const navigate = useNavigate()
    const [linkedOperations, setLinkedOperations] = useState<number[]>([])
    const [initialValues, setInitialValues] = useState<IClass>(null)
    const [isContinue, setIsContinue] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const { forceUpdate } = useClassesStore.getState()
    const { forceUpdate: forceUpdateAttrsStore } = useAttributesStore.getState()

    Form.useWatch(FORM_NAMES.PACKAGE, form)

    useEffect(() => {
        if (classId !== undefined) {
            SERVICES_CLASSES.Models.getClassById({ id: String(classId) }).then((response) => {


                if (response.success) {
                    if (response?.data !== undefined) {

                        if (response?.data?.operations && response?.data?.operations?.length > 0) {

                            setLinkedOperations(response?.data?.operations.map(oper => oper.id))
                        }
                        form.setFieldsValue(response?.data)
                        setInitialValues(response?.data)

                        if (response.data?.attributes.length > 0) {
                            response.data?.attributes.forEach(attr => {
                                form.setFieldsValue({
                                    [`attr_initial_value_${attr.id}`]: attr?.pivot?.initial_value,
                                    [`attr_static_feature_${attr.id}`]: attr?.pivot?.static_feature,
                                    [`attr_sort_order_${attr.id}`]: attr?.pivot?.order
                                })
                            })
                        }
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId])

    const iconsArray = useMemo(() => Object.keys(Icons).map((icon) => {
        return {
            value: icon,
            label: (
                <Space>
                    <ECIconView icon={icon as any} />
                    <Text>{icon}</Text>
                </Space>
            ),
        }
    }), [Icons])


    const onSubmit = async (values: any) => {
        setDisabled(true)
        await saveClass({
            classId,
            values,
            linkedOperations,
            linkedAttributes,
            setClassId,
            navigate,
            isContinue,
            form,
            forceUpdate,
            forceUpdateAttrsStore 
        })
        setDisabled(false)
    }

    const tabsItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Атрибуты',
            children: (
                <TableForLinkAttributes
                    form={form}
                    classId={classId}
                    setLinkedAttributes={setLinkedAttributes}
                    linkedAttributes={linkedAttributes}
                />
            ),
        },
        {
            key: '2',
            label: 'Связи',
            children: (
                classId
                    ? <RelationTableContainer classId={Number(classId)} isModal ={true} />
                    : <Title level={3}>Заведение связей доступно только после создания объекта</Title>

            )
        },
        {
            key: '3',
            label: 'Операции',
            children: (
                <TableForLinkOperations
                    classId={classId}
                    linkedOperations={linkedOperations}
                    setLinkedOperations={setLinkedOperations}
                />
            ),
        },
    ]


    const handleCancelButton = () => {

        Object.keys(form.getFieldsValue()).forEach(field => {
            form.setFieldsValue({
                [field]: null
            })
        })
    }

    const handleUndoChangesButton = () => {
        if (classId) {
            form.setFieldsValue(initialValues)

            return
        }
        handleCancelButton()
    }


    return (
        <Form labelAlign="left" form={form} onFinish={onSubmit}>
            <Card>
        
                <Col span={24}>
                    <Col span={24}>
                        <Row gutter={8}>
                            <Col span={5}>
                                <Form.Item labelAlign="left" label="Имя класса" name={FORM_NAMES.NAME} required>
                                    <Forms.Input placeholder="Введите имя класса" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item labelAlign="left" label="Код" name={FORM_NAMES.CODE} required>
                                    <Forms.Input
                                        disabled={id ? true : false} 
                                        placeholder="Введите код"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>

                                <Form.Item labelAlign="left" label="Иконка" name={FORM_NAMES.ICON}>
                                    <Forms.IconSelect placeholder="Выберите иконку класса" {...props} />
                                    {/* <Forms.Select
                                            placeholder="Выберите иконку класса"
                                            customData={{
                                                data: iconsArray.slice(1, iconsArray.length ) ?? [],
                                                convert: {
                                                    valueField: 'value',
                                                    optionFilterProp: 'value',
                                                    optionLabelProp: 'label',
                                                },
                                            }}
                                            {...props}
                                        /> */}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row gutter={8}>
                            <Col span={5}>
                                {' '}
                                <VisibilitySelect name={FORM_NAMES.VISIBILITY} required={true} />
                            </Col>
                            <Col span={5}>
                                {' '}
                                <PackageSelect name={FORM_NAMES.PACKAGE} required={true} />
                            </Col>
                            <Col span={4}>
                                <ClassStereotypesSelect
                                    package_id={form.getFieldValue(FORM_NAMES.PACKAGE)}
                                    disabled={form.getFieldValue(FORM_NAMES.PACKAGE) ? false : true}
                                    name={FORM_NAMES.STEREOTYPE}
                                />
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={3}>
                                <Form.Item name={FORM_NAMES.MULTIPLICITY_LEFT} label="Кратность от ">
                                    <Input style={{ width: '100%' }} type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Form.Item name="multiplicity" label="до">
                                    <Input style={{ width: '100%' }} type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                <ButtonHelp
                                    tooltipText={
                                        <>
                                            <Text style={{ color: '#ffffff' }}>
                                                Кратность класса показывает сколько объектов этого класса
                                            </Text>{' '}
                                            <Text style={{ color: '#ffffff' }} strong>
                                                необходимо (от){' '}
                                            </Text>
                                            <Text style={{ color: '#ffffff' }}>создать в системе и сколько
                                            </Text>{' '}
                                            <Text style={{ color: '#ffffff' }} strong>
                                                максимально возможно (до)
                                            </Text>
                                        </>
                                    }
                                />
                            </Col>
                            <Col span={2}>
                                <Form.Item colon={false} name={FORM_NAMES.IS_ABSTRACT} valuePropName="checked">
                                    <Forms.CheckBox> Абстрактный</Forms.CheckBox>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item colon={false} name="has_anonymous_objects" valuePropName="checked">
                                    <Forms.CheckBox>Анонимные объекты</Forms.CheckBox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>


                </Col>
                <ButtonsFormRow
                    handleCancelButton={handleCancelButton}
                    handleSaveAndGoToListButton={() => { setIsContinue(true)}}
                    handleUndoChangesButton={handleUndoChangesButton}
                    disabled={disabled}
                />
            </Card>

            <Card style={{ marginTop: '20px' }}>
                {' '}
                <Tabs defaultActiveKey="1" items={tabsItems} />
            </Card>
        </Form>
    )
}

export default ClassesFormContainer2
/* eslint-disable max-len */
import { IRelation, relationsTypes, relationTypesLeft, relationTypesRight } from '@shared/types/relations'
import { Forms, Input } from '@shared/ui/forms'
import { Col, Collapse, Divider, Form, FormInstance, message, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { createOptions } from '@shared/ui/forms/Select/createOptions'
import { Rule } from 'antd/es/form'
import { relationsPayload, relationTypesData } from '../RelationTableContainer/relationsTableData'
import { useApi } from '@shared/hooks/useApi'
import { IClass } from '@shared/types/classes'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import { ButtonHelp, ButtonSubmit } from '@shared/ui/buttons'
import { TRelationPayload } from '@shared/api/Relations/types'
import { getRelationById } from '@shared/api/Relations/Models/getRelationById/getRelationById'
import { postRelation } from '@shared/api/Relations/Models/postRelation/postRelation'
import { patchRelationById } from '@shared/api/Relations/Models/patchRelationById/patchRelationById'
import { IRelationStereotype } from '@shared/types/relation-stereotypes'
import { getRelationStereotypes } from '@shared/api/RelationStereotypes/Models/getRelationStereotypes/getRelationStereotype'
import { useNavigate } from 'react-router'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ECLoader } from '@shared/ui/loadings'
import { getURL } from '@shared/utils/nav'
import { responseErrorHandler } from '@shared/utils/common'
import ConstraintsForm from '@entities/relations/ConstraintsForm/ConstraintsForm'
import { IConstraint } from '@shared/types/constraints'
import { SERVICES_CONSTRAINTS } from '@shared/api/Constraints'

import { DefaultModal } from '@shared/ui/modals'
import { REL_TYPES_DESCRIPTION } from '../utils'

import { useWatch } from 'antd/es/form/Form'



interface IRelationFormFields {
    name: string
    relType: keyof typeof relationsTypes | ''
    source: number
    sourceAttr: number
    sourceMultLeft: number
    sourceMultRight: number
    aim: number
    aimAttr: number
    aimMultLeft: number
    aimMultRight: number
    assocClass: number
    relationStereotypeId: number
    codename: string
}

interface IRelationFormContainer {
    id?: number
    form: FormInstance<IRelationFormFields>
    style?: React.CSSProperties
    classId?: number
    modal?: any,
    relations?: any
}

const fieldNames = Object.fromEntries(
    Object.keys({
        name: '',
        relType: '',
        source: '',
        sourceAttr: '',
        sourceMultLeft: '',
        sourceMultRight: '',
        aim: '',
        aimAttr: '',
        aimMultLeft: '',
        aimMultRight: '',
        assocClass: '',
        relationStereotypeId: '',
        codename: '',
    }).map((k) => [k, k])
) as Record<keyof IRelationFormFields, string>
const fields = fieldNames

const labels: Partial<Record<keyof typeof fieldNames, string>> = {
    name: 'Название',
    relType: 'Тип связи',
    source: 'Источник',
    sourceAttr: 'Атрибуты источника',
    sourceMultLeft: 'Кратность',
    sourceMultRight: 'Кратность',
    aim: 'Цель',
    aimAttr: 'Атрибуты цели',
    aimMultLeft: 'Кратность',
    aimMultRight: 'Кратность',
    assocClass: 'Класс связи',
    relationStereotypeId: 'Стереотип связи',
    codename: 'Код',
}

const REL_TYPE_ICONS = {
    association: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
            <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 12h16m-7-7l7 7l-7 7"
            />
        </svg>
    ),
    aggregation: (
        <div style={{ transform: 'rotate(90deg)' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 56 56"><path fill="currentColor" d="M27.988 52c1.29 0 1.946-.867 3.258-2.648l13.992-18.68c.633-.867 1.008-1.735 1.008-2.672c0-.961-.375-1.805-1.008-2.672L31.246 6.625C29.934 4.867 29.277 4 27.988 4c-1.265 0-1.922.867-3.234 2.625L10.762 25.328c-.633.867-1.008 1.711-1.008 2.672c0 .938.375 1.805 1.008 2.672l13.992 18.68C26.066 51.132 26.723 52 27.988 52m0-4.945c-.093 0-.164-.07-.21-.188L14.206 28.633c-.21-.258-.234-.445-.234-.633c0-.187.023-.375.234-.633L27.777 9.11c.047-.093.117-.164.211-.164c.117 0 .188.07.235.164l13.57 18.258c.21.258.234.445.234.633s-.023.375-.234.633l-13.57 18.234c-.047.117-.117.188-.235.188" /></svg> </div>
    ),
    composition: (
        <div style={{ transform: 'rotate(90deg)' }}> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 56 56"><path fill="#000000" d="M27.988 52c1.29 0 1.946-.867 3.258-2.648l13.992-18.68c.633-.867 1.008-1.735 1.008-2.672c0-.961-.375-1.805-1.008-2.672L31.246 6.625C29.934 4.867 29.277 4 27.988 4c-1.265 0-1.922.867-3.234 2.625L10.762 25.328c-.633.867-1.008 1.711-1.008 2.672c0 .938.375 1.805 1.008 2.672l13.992 18.68C26.066 51.132 26.723 52 27.988 52" /></svg></div>
    ), generalization: (
        <div style={{ transform: 'rotate(90deg)' }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1024 0l1024 2048H0zm0 382L276 1877h1496z" /></svg> </div>
    ),
    dependency: (
        <div style={{ transform: 'rotate(180deg)' }}>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45px" height="45px" viewBox="0 0 56 56">
                <g>

                    <rect x="30" y="31" width="4" height="2" />
                    <rect x="12" y="31" width="4" height="2" />
                    <rect x="18" y="31" width="4" height="2" />
                    <rect x="24" y="31" width="4" height="2" />
                    <rect x="6" y="31" width="4" height="2" />
                    <polygon points="9.146,22.293 0,31.293 0,32.707 9.146,41.707 10.634,40.293 3.414,33 4,33 4,31 3.414,31 10.634,23.707  " />
                </g>
            </svg>
        </div>
    )
}



const relOptions = relationTypesData.map((item) => ({ value: item.type, label: <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>{item.label} {REL_TYPE_ICONS[item.type]}</div> }))

const required: Rule[] = [{ required: true, message: 'Обязательно' }]

const ItemDivider: React.FC = () => <Divider style={{ marginTop: 0 }} />

const RelationFormContainer: React.FC<IRelationFormContainer> = ({ id, form, style, classId, modal, relations, }) => {
    const classes = useApi<IClass[]>([], getClasses, { all: true })

    const relationStereotypes = useApi<IRelationStereotype[]>([], getRelationStereotypes, { all: true })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { resetFields = () => { }, setFieldsValue = () => { } } = form
    const navigate = useNavigate()
    const [values, setValues] = useState<Partial<IRelationFormFields>>({})
    const [, ctx] = message.useMessage()
    const [currentRelationType, setCurrentRelationType] = useState<IRelation['relation_type']>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(id ? true : false)

    const [constraints, setConstraints] = useState<IConstraint[]>([])

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const submit = async () => {
        await form.validateFields()
        setIsLoading(true)
        const payload: TRelationPayload = {
            name: values.name,
            relation_type: values.relType as any,
            left_class_id: values.source,
            left_attribute_id: values.sourceAttr,
            left_multiplicity_left: values.sourceMultLeft || 0,
            left_multiplicity_right: values.sourceMultRight || null,
            right_class_id: values.aim,
            right_attribute_id: values.aimAttr,
            right_multiplicity_left: values.aimMultLeft || 0,
            right_multiplicity_right: values.aimMultRight || null,
            assoc_class_id: values.assocClass,
            relation_stereotype_id: values.relType == 'association' ? values.relationStereotypeId : null,
        }

        if (!id) {
            payload['codename'] = values.codename
        }

        const response = id ? await patchRelationById(`${id}`, payload) : await postRelation(payload)

        if (response.success) {
            if (response.data?.id) {
                const constraintErrors: any[] = []

                await Promise.all(
                    constraints.map(async (constraint: IConstraint) => {
                        const resp: any =
                            typeof constraint.id === 'number'
                                ? await SERVICES_CONSTRAINTS.Models.patchConstraint({
                                    id: typeof constraint.id === 'number' ? constraint.id : Number(constraint.id),
                                    ...constraint,
                                    relation_id: response.data.id,
                                })
                                : await SERVICES_CONSTRAINTS.Models.postConstraint({
                                    ...constraint,
                                    relation_id: response.data.id,
                                })

                        if (!resp.success) {
                            Object.values(resp.error.errors).forEach((er) =>
                                constraintErrors.push(`Ошибка в сохранении ограничения ${constraint.name}: ${er}`)
                            )
                        }
                    })
                )

                if (constraintErrors?.length == 0) {
                    Modal.success({
                        content: `Связь успешно ${id ? 'изменена' : 'создана'}`,
                    })

                    if (modal == undefined) {
                        navigate(getURL(`${ROUTES.RELATIONS}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        // navigate(`/${ROUTES.RELATIONS}/${ROUTES_COMMON.LIST}`)
                    } else {
                        modal.close()
                        relations?.request(relationsPayload)?.then()
                    }
                } else {
                    setIsLoading(false)
                    Modal.error({
                        content: constraintErrors.map((item) => (
                            <div key={item}>
                                {item}
                                <br />
                                <br />
                            </div>
                        )),
                        style: { zIndex: '999999' },
                    })
                }
            }


        } else {
            setIsLoading(false)
            responseErrorHandler({ response: response, modal: Modal, errorText: `Ошибка при ${id ? 'редактировании' : 'создании'} связи` })
        }
    }

    useEffect(() => {
        if (!id) {
            resetFields()

            return
        }

        getRelationById(`${id}`).then((response) => {
            if (response.success && response.data) {
                const { data: d } = response

                const values: IRelationFormFields = {
                    name: d.name,
                    relType: d.relation_type,
                    source: d.left_class_id,
                    sourceAttr: d.left_attribute_id,
                    sourceMultLeft: d.left_multiplicity_left,
                    sourceMultRight: d.left_multiplicity_right || null,
                    aim: d.right_class_id,
                    aimAttr: d.right_attribute_id,
                    aimMultLeft: d.right_multiplicity_left,
                    aimMultRight: d.right_multiplicity_right || null,
                    assocClass: d.assoc_class_id,
                    relationStereotypeId: d.relation_stereotype_id,
                    codename: d.codename,
                }

                setCurrentRelationType(d.relation_type)
                setFieldsValue(values)
                setValues(values)
                setIsLoading(false)
            }
        })

        SERVICES_CONSTRAINTS.Models.getConstraints({ all: true, relation_id: id }).then((response) => {
            if (response.success && response.data) {
                setConstraints(response.data)
            }
        })
    }, [id, resetFields, setFieldsValue])

    const checkRelationDirType = (dirType: 'left' | 'right') => {
        if (dirType == 'left') {
            return relationTypesLeft.includes(currentRelationType)
        }

        if (dirType == 'right') {
            return relationTypesRight.includes(currentRelationType)
        }

        return false
    }

    useEffect(() => {

        if (currentRelationType && classId) {
            const checkLeft = checkRelationDirType('left')
            const fieldName = checkLeft ? fields.source : fields.aim

            if (!form.getFieldValue([`${fieldName}`])) {
                form.setFieldValue(fieldName, classId)
            }

            return
        }

        if (classId) {
            form.setFieldValue(fields.source, undefined)
            form.setFieldValue(fields.aim, undefined)

            return
        }
    }, [currentRelationType, classId])

    return (
        <>
            <DefaultModal
                title="Просмотр типов связей"
                width="30%"
                isModalVisible={isModalVisible}
                handleCancel={() => {
                    setIsModalVisible(false)
                }}
            >
                <>
                
                    {relationTypesData.map(relType => {
                        return (
                            <Collapse
                                defaultActiveKey={form.getFieldValue('relType') ==  relType.type ? ['1'] : []}
                                style={{ marginBottom: '10px' }}
                                key={relType.type}
                                items={[{ key: '1', label: relType.label, children: <p>{REL_TYPES_DESCRIPTION[relType.type]}</p> }]}
                            />
                        )
                    })}               
                </>
            </DefaultModal>
            {ctx}

            {isLoading ? (
                <Col span={24} style={{ textAlign: 'center' }}>
                    {' '}
                    <ECLoader size="large" />{' '}
                </Col>
            ) : (
                <Form
                    style={style}
                    form={form}
                    initialValues={{
                        sourceMultLeft: 0,
                        sourceMultRight: null,
                        aimMultLeft: 0,
                        aimMultRight: null,
                    }}
                    onValuesChange={(cv, v) => {
                        setValues(v)

                        if ('relType' in v) {
                            setCurrentRelationType(v.relType as any)
                        }
                    }}
                    labelCol={{ xs: 4 }}
                >
                    <ButtonSubmit style={{ background: 'green' }} onClick={submit} />
                    <Row gutter={8} align="middle" style={{ marginTop: 20 }}>
                        {/* Разобраться с формами и узнать как поставить зависимости */}
                        <Col xs={3} style={{ marginBottom: 24 }}>
                            {labels.name}:
                        </Col>
                        <Col xs={7}>
                            <Form.Item colon={false} label=" " rules={required} name={fieldNames.name}>
                                <Forms.Input placeholder="Введите название связи" />
                            </Form.Item>
                        </Col>
                        <Col xs={2} style={{ marginBottom: 24 }}>
                            {labels.codename}:
                        </Col>
                        <Col xs={4}>
                            <Form.Item colon={false} label=" " rules={required} name={fieldNames.codename}>
                                <Forms.Input
                                    disabled={id ? true : false}
                                    placeholder="Введите код"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={2} style={{ marginBottom: 24 }}>
                            {labels.relType}:
                        </Col>
                        <Col xs={4}>
                            <Form.Item colon={false} label=" " rules={required} name={fieldNames.relType}>
                                <Forms.Select options={relOptions} placeholder={labels.relType} />
                            </Form.Item>
                        </Col>
                        <Col span={1} style={{ marginBottom: 24 }}>
                            <ButtonHelp
                                tooltipText="Описание типов связи"
                                onClick ={() => {setIsModalVisible(true)}}

                            />
                        </Col>
                    </Row>

                    <ItemDivider />

                    <Row gutter={8} align="middle">
                        <Col xs={3} style={{ marginBottom: 24 }}>
                            {labels.source}:
                        </Col>
                        <Col xs={7}>
                            <Form.Item colon={false} label=" " name={fields.source} rules={values.relType && required}>
                                {currentRelationType && checkRelationDirType('left') ? (
                                    <Forms.Select options={createOptions(classes.data)} disabled={!!classId} />
                                ) : values.relType !== undefined ? (
                                    <Forms.Select options={createOptions(classes.data)} disabled={false} />
                                ) : (
                                    <Forms.Select options={createOptions(classes.data)} disabled={!!classId} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col xs={6}>
                            <Form.Item
                                colon={false}
                                label=""
                                name={fields.sourceAttr}
                                rules={values.relType === 'dependency' && required}
                            >
                                <Forms.Select
                                    options={createOptions(
                                        classes.data.find((cls) => cls.id == values.source)?.attributes ?? []
                                    )}
                                    loading={classes.loading}
                                    disabled={values.relType !== 'dependency'}
                                    placeholder="Атрибуты"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={4}>
                            <Form.Item label="Кратность" name={fields.sourceMultLeft} colon={false} labelCol={{ span: 10, offset: 2 }}  >
                                <Input type="number" min={0}  />
                            </Form.Item>
                        </Col>
                        <Col xs={2}>
                            <Form.Item label="" name={fields.sourceMultRight} colon={false}>
                                <Input style={{ width: '100%' }} type="number" min={0} step={1} />
                            </Form.Item>
                        </Col>
                        <Col span={1} style={{ marginBottom: 24 }}>
                            <ButtonHelp
                                tooltipText="Кратность показывает сколько объектов по этой связи может быть по ней 
                        привязано к объекту данного класса: минимально (от) и максимально (до)"
                            />
                        </Col>
                    </Row>

                    <Row gutter={8} align="middle">
                        <Col xs={3} style={{ marginBottom: 24 }}>
                            {labels.aim}:
                        </Col>
                        <Col xs={7}>
                            <Form.Item colon={false} label=" " name={fields.aim} rules={values.relType && required}>
                                {currentRelationType && checkRelationDirType('right') ? (
                                    <Forms.Select options={createOptions(classes.data)} disabled={!!classId} />
                                ) : values.relType !== undefined ? (
                                    <Forms.Select options={createOptions(classes.data)} disabled={false} />
                                ) : (
                                    <Forms.Select options={createOptions(classes.data)} disabled={!!classId} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col xs={6}>
                            <Form.Item
                                colon={false}
                                label=""
                                name={fields.aimAttr}
                                rules={values.relType === 'dependency' && required}
                            >
                                <Forms.Select
                                    options={createOptions(
                                        classes.data.find((cls) => cls.id == values.aim)?.attributes ?? []
                                    )}
                                    loading={classes.loading}
                                    disabled={values.relType !== 'dependency'}
                                    placeholder="Атрибуты"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={4}>
                            <Form.Item label="Кратность" name={fields.aimMultLeft} colon={false} labelCol={{ span: 10, offset: 2 }}  >
                                <Input type="number" min={0} step={1} />
                            </Form.Item>
                        </Col>
                        <Col xs={2}>
                            <Form.Item colon={false} label="" name={fields.aimMultRight} labelCol={{ span: 10, offset: 2 }}>
                                <Input style={{ width: '100%' }} type="number" min={0} step={1} />
                            </Form.Item>
                        </Col>
                        <Col span={1} style={{ marginBottom: 24 }}>
                            <ButtonHelp
                                tooltipText="Кратность показывает сколько объектов по этой связи может быть по ней 
                        привязано к объекту данного класса: минимально (от) и максимально (до)"
                            />
                        </Col>
                    </Row>

                    <Row gutter={8} align="middle">
                        <Col xs={3} style={{ marginBottom: 24 }}>
                            {labels.assocClass}:
                        </Col>
                        <Col xs={7}>
                            <Form.Item colon={false} label=" " name={fields.assocClass}>
                                <Forms.Select
                                    options={createOptions(
                                        classes.data.filter((cls) => {
                                            return ![values.source, values.aim].includes(cls.id)
                                        })
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8} align="middle">
                        <Col xs={3} style={{ marginBottom: 24 }}>
                            {labels.relationStereotypeId}:
                        </Col>
                        <Col xs={7}>
                            <Form.Item colon={false} label=" " name={fields.relationStereotypeId}>
                                <Forms.Select
                                    options={createOptions(relationStereotypes.data.filter((el) => el.name))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {currentRelationType == 'dependency' && <> <Divider orientation="left">Ограничения</Divider> <ConstraintsForm form={form} constraints={constraints} setConstraints={setConstraints} /> </>}
                </Form>
            )}
        </>
    )
}

export default RelationFormContainer
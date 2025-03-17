import { FC, useEffect, useState } from 'react'
import { Form, FormInstance, Row, Col, Card, Spin } from 'antd'
import { Forms } from '@shared/ui/forms'

import { SERVICES_RELATIONS } from '@shared/api/Relations'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { SERVICES_LINKS } from '@shared/api/Links'
import { SERVICES_ATTRIBUTE_STEREOTYPES } from '@shared/api/AttributeStereotypes'
// import { ASSOCIATION_KEYS } from '@shared/config/const'
import { relationsTypes } from '@shared/types/relations'

interface IRelationsForm {
    form?: FormInstance<any>
    id?: number | string
    classId: number
    setLinks: any
}
const RelationsForm: FC<IRelationsForm> = ({ id, form, classId, setLinks }) => {
    const [data, setData] = useState<
        Record<
            number,
            {
                className: string
                relationId: number
                objects: any
            }
        >
    >({})
    const [isLoading, setLoading] = useState(true)
    const [attributesWithNameStereotype, setAttributesWithNameStereotype] = useState([])

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            const [relations, objects, links] = await Promise.all([
                SERVICES_RELATIONS.Models.getRelations({ all: true }),
                SERVICES_OBJECTS.Models.getObjects({ all: true }),
                SERVICES_LINKS.Models.getLinks({ all: true }),
            ])

            const filteredRelations = relations.data.filter(
                (relation) =>
                    relation.left_class_id === classId && relation.relation_type === relationsTypes.association
            )

            const result = {}

            if (id) {
                const filteredLinks = links.data.filter(
                    (relation) =>
                        relation.left_object_id === id &&
                    relation.relation.relation_type === relationsTypes.association
                )

                filteredLinks.forEach((relation) => {
                    const relationId = relation.id
                    /* const currClass = aggregation.association.left_class.name */

                    objects.data.forEach((object) => {
                        if (object.class_id === relation.relation.right_class_id) {
                            if (!result[relationId]) {
                                result[relationId] = {
                                    className: relation.relation.name || relation.relation_id,
                                    relationId: relationId,
                                    objects: [{ ...object }],
                                }
                            } else {
                                result[relationId].objects.push({ ...object })
                            }
                        }
                    })
                })
            } else {
                filteredRelations.forEach((relation) => {
                    const relationId = relation.id
                    const currClass = relation.name || relation.id

                    objects.data.forEach((object) => {
                        if (object.class_id === relation.right_class_id) {
                            if (!result[relationId]) {
                                result[relationId] = {
                                    className: currClass,
                                    relationId: relationId,
                                    objects: [{ ...object }],
                                }
                            } else {
                                result[relationId].objects.push({ ...object })
                            }
                        }
                    })
                })
            }

            setData(result)
            setLoading(false)
        }

        getData()
    }, [classId, id])

    useEffect(() => {
        if (id !== undefined) {
            SERVICES_LINKS.Models.getLinks({ all: true }).then((response) => {
                if (response.success) {
                    if (response?.data !== undefined) {
                        const filteredLinks = response.data.filter(
                            (link) =>
                                link.relation.relation_type === relationsTypes.association &&
                                link.left_object_id === id
                        )

                        const formData = {}

                        filteredLinks.forEach((link) => {
                            formData[link.id] = link.right_object_id
                        })

                        form.setFieldsValue(formData)
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        const getStereotypes = async () => {
            const attrStereotypes = await SERVICES_ATTRIBUTE_STEREOTYPES.Models.getAttributeStereotypes({ all: true })

            const attributesWithNameStereotype = attrStereotypes.data.filter((item) => item.mnemo === 'name')

            setAttributesWithNameStereotype(attributesWithNameStereotype)
        }

        getStereotypes()
    }, [])

    const onChangeHandler = (value, values) => {
        if (id) {
            const relationsValues = Object.entries(values).map((item) => ({
                left_object_id: id,
                right_object_id: item[1],
                id: item[0],
            }))

            setLinks((prevState) => ({
                ...prevState,
                relations: relationsValues,
            }))
        } else {
            const relationsValues = Object.entries(values).map((item) => ({
                left_object_id: undefined,
                right_object_id: item[1],
                relation_id: item[0],
            }))

            setLinks((prevState) => ({
                ...prevState,
                relations: relationsValues,
            }))
        }
    }

    return (
        <div style={{ margin: '20px 0' }}>
            {isLoading ? (
                <Spin size="large" style={{ textAlign: 'center' }} />
            ) : (
                Boolean(Object.keys(data).length) && (
                    <Card>
                        <Form
                            name="formRelations"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 8 }}
                            autoComplete="off"
                            form={form}
                            labelAlign="left"
                            onValuesChange={onChangeHandler}
                        >
                            {Object.values(data).map((item) => (
                                <Row key={item.relationId}>
                                    <Col span={5}>{item.className}</Col>
                                    <Col span={10} style={{ display: 'flex' }}>
                                        <Form.Item
                                            label
                                            colon={false}
                                            labelCol={{ offset: 1, span: 1 }}
                                            wrapperCol={{ span: 14 }}
                                            name={item.relationId}
                                            required
                                        >
                                            <Forms.Select
                                                options={item.objects.map((object) => {
                                                    const attributeWithName = object.object_attributes.find((item) =>
                                                        attributesWithNameStereotype.find(
                                                            (item2) =>
                                                                item2.id === item.attribute.attribute_stereotype_id
                                                        )
                                                    )

                                                    return {
                                                        value: object.id,
                                                        label: attributeWithName?.attribute_value || object.id,
                                                    }
                                                })}
                                                style={{ width: '400px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ))}
                        </Form>
                    </Card>
                )
            )}
        </div>
    )
}


export default RelationsForm
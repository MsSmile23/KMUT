import { useEffect, useState } from 'react';
//import { SERVICES_ASSOCIATIONS } from '@shared/api/Associations';
import { SERVICES_OBJECTS } from '@shared/api/Objects';
import { SERVICES_LINKS } from '@shared/api/Links';
import { Card, Col, Form, Row, Space, Spin } from 'antd';
import { Forms } from '@shared/ui/forms'
import { Buttons } from '@shared/ui/buttons'
import { relationsTypes } from '@shared/types/relations';
import { SERVICES_RELATIONS } from '@shared/api/Relations';
import { IObject } from '@shared/types/objects';
import { ILink } from '@shared/types/links';
import { getClassFromClassesStore } from '@shared/utils/common';

interface IFormField {
    aggregation_id: number,
    minFields: number,
    maxFields: number,
    className: string | number,
    objects: IObject[],
    links: ILinkField[]
}
interface ILinkField {
    id: number,
    value: number,
    isDeletable: boolean,
    isNextAddable: boolean
    isRequired: boolean
}


const AggregationForm = ({ form, id, classId, onChangeLinks }) => {
    const [isLoading, setLoading] = useState(true)
    //const [aggrFields, setAggrFields] = useState<IAggrFormField[]>([])
    //const [linkFields, setLinkFields] = useState([])
    const [formFields, setFormFields] = useState<IFormField[]>([])

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            const relations = await SERVICES_RELATIONS.Models.getRelations({ all: true })
            const objects = await SERVICES_OBJECTS.Models.getObjects({ all: true })

            if (id) {
                const links = await SERVICES_LINKS.Models.getLinks({ all: true })

                const filteredLinks = links.data.filter((link) => {
                    return link.right_object_id == id
                })
            }

            const filteredAggregations = relations.data.filter(
                (relation) =>
                    relation.right_class_id === classId &&
                relation.relation_type === relationsTypes.aggregation
            )



            const tmpFormFields: IFormField[] = filteredAggregations.map((aggregation) => {
                const aggObjects = objects.data.filter( object => object.class_id === aggregation.left_class_id)
                const formField: IFormField = {
                    aggregation_id: aggregation.id,
                    minFields: aggregation.right_multiplicity_left,
                    maxFields: aggregation.right_multiplicity_right || Infinity,
                    className:
                        aggregation.name || getClassFromClassesStore(aggregation.left_class_id)?.name || aggregation.id,
                    objects: aggObjects ?? [],
                    links: [],
                }

                //Заполняем поля связей по минимальной кратности
                if (formField.minFields == 0) {
                    formField.links.push({
                        id: 0,
                        value: 0,
                        isDeletable: false,
                        isNextAddable: (1 < formField.maxFields),
                        isRequired: false,
                    })
                }
                for (let i = 1; i <= formField.minFields; i++ ) {
                    formField.links.push({
                        id: 0,
                        value: 0,
                        isDeletable: false,
                        isNextAddable: (i < formField.maxFields),
                        isRequired: true,
                    })
                }

                return formField
            })

            setFormFields(tmpFormFields)
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
                                link.relation.relation_type === relationsTypes.aggregation &&
                                link.right_object_id === id
                        )

                        const formData = {}

                        filteredLinks.forEach((link) => {
                            formData[link.id] = link.left_object_id
                        })

                        form.setFieldsValue(formData)
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const onChangeHandler = (value, values) => {

        const aggregationsValues: Partial<ILink>[] = []

        formFields.map((aggrFormField) => {
            aggrFormField.links.map( (linkFormField, index) => {
                const name = `${aggrFormField.aggregation_id}_${index}`;
                const tmpAggrValue = {
                    left_object_id: values?.[name] ?? 0,
                    relation_id: aggrFormField.aggregation_id,
                    id: linkFormField.id && linkFormField.id !== 0 ? linkFormField.id : undefined
                }

                aggregationsValues.push(tmpAggrValue)
            })
        })
        onChangeLinks({ aggregations: aggregationsValues })
        /*
        setLinks((prevState) => ({
            ...prevState,
            aggregations: aggregationsValues,
        }))



        if (id) {
            const aggregationsValues = Object.entries(values).map((item) => ({
                left_object_id: item[1],
                right_object_id: id,
                id: item[0],
            }))

            setLinks((prevState) => ({
                ...prevState,
                aggregations: aggregationsValues,
            }))
        } else {
            const aggregationsValues = Object.entries(values).map((item) => ({
                left_object_id: item[1],
                right_object_id: undefined,
                association_id: item[0],
            }))

            setLinks((prevState) => ({
                ...prevState,
                aggregations: aggregationsValues,
            }))
        }

         */
    }

    const onAdd = (aggregation_id) => {
        const newFormFields = formFields.map( formField => {
            if (formField.aggregation_id == aggregation_id) {
                formField.links.push({
                    id: 0,
                    value: 0,
                    isDeletable: true,
                    isNextAddable: (formField.links.length + 1 < formField.maxFields),
                    isRequired: true,
                })
            }

            return formField
        })

        setFormFields(newFormFields)
    }

    const onDelete = (aggregation_id, index) => {
        const newFormFields = formFields.map( formField => {
            if (formField.aggregation_id == aggregation_id) {
                formField.links.splice(index, 1);
            }

            return formField
        })

        setFormFields(newFormFields)
    }

    return (
        <div style={{ margin: '20px 0' }}>
            {isLoading ? (
                <Spin size="large" style={{ textAlign: 'center' }} />
            ) : (
                <Card>
                    <Form
                        name="formAggregations"
                        labelCol={{ span: 8 }}
                        autoComplete="off"
                        form={form}
                        labelAlign="left"
                        onValuesChange={onChangeHandler}
                    >
                        {formFields.map((aggrFormField) => {

                            return (
                                <>
                                    { aggrFormField.links.map( (linkFormField, index) => {
                                        const name = `${aggrFormField.aggregation_id}_${index}`;
                                        const isLast = index + 1 == aggrFormField.links.length

                                        return (
                                            <Row key={name}>
                                                <Col span={5}>{aggrFormField.className}</Col>
                                                <Col span={8} style={{ display: 'flex' }}>
                                                    <Form.Item
                                                        label
                                                        colon={false}
                                                        labelCol={{ offset: 1, span: 1 }}
                                                        wrapperCol={{ span: 14 }}
                                                        name={name}
                                                        required={!linkFormField.isRequired}
                                                    >
                                                        <Forms.Select
                                                            options={aggrFormField.objects.map((object) => {
                                                                const publicAttrs = object.object_attributes.filter(
                                                                    (item) =>
                                                                        item.attribute.visibility == 'public'
                                                                        && item.attribute_value
                                                                ).map(item =>
                                                                    `${item.attribute.name}: ${item.attribute_value}`)

                                                                const attributeName =
                                                                    (publicAttrs.length > 0)
                                                                        ? publicAttrs.join(', ')
                                                                        : `${object.class.name} [${object.id}]`

                                                                return {
                                                                    value: object.id,
                                                                    label: attributeName
                                                                }
                                                            })}
                                                            style={{ width: '400px' }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={5}>
                                                    <Space>
                                                        { linkFormField.isDeletable &&
                                                            <Buttons.ButtonDeleteRow
                                                                onClick={() => {
                                                                    onDelete(aggrFormField.aggregation_id, index)
                                                                }}
                                                            /> }
                                                        { linkFormField.isNextAddable && isLast &&
                                                            <Buttons.ButtonAddRow
                                                                onClick={() => {
                                                                    onAdd(aggrFormField.aggregation_id)
                                                                }}
                                                            /> }
                                                    </Space>
                                                </Col>
                                            </Row>
                                        )}
                                    )}
                                </>
                            )
                        })}
                    </Form>
                </Card>
            )}
        </div>
    )
}

export default AggregationForm
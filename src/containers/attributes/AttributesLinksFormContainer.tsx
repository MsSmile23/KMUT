/* eslint-disable react/jsx-max-depth */
import { FC, useEffect, useState } from 'react'
import { Card, Col, Form, Row, message } from 'antd'

import { Select } from '@shared/ui/forms/Select/Select'
import { SERVICES_PACKAGES } from '@shared/api/Packages'
import { SERVICES_CLASSES } from '@shared/api/Classes'
import { SERVICES_ATTRIBUTES } from '@shared/api/Attribute'
import { SimpleTable } from '@shared/ui/tables'
import { CheckBox } from '@shared/ui/forms'
import { ButtonSubmit } from '@shared/ui/buttons'
import { Spin } from 'antd'
import { IAttribute } from '@shared/types/attributes';


const AttributesLinksFormContainer: FC = () => {
    const [form] = Form.useForm()
    const [packagesOptions, setPackagesOptions] = useState<any[]>([])
    const [classes, setClasses] = useState<any[]>([])
    const [attributes, setAttributes] = useState<any[]>([])
    const [columns, setColumns] = useState<any[]>([])
    const [rows, setRows] = useState<any[]>([])
    const [filteredClasses, setFilteredClasses] = useState<any[]>([])
    const [filteredAttributes, setFilteredAttributes] = useState<any[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isClassesLoading, setIsClassesLoading] = useState<boolean>(true)

    const [compState, setCompState] = useState({
        isLoading: true,
        isClassesLoading: true,
        isSubmitLoading: false,
    })


    const [chosenClassesIds, setChosenClassesIds] = useState<number[]>([])

    const getSourceData = async () => {

        const responsePackages = await SERVICES_PACKAGES.Models.getPackages({ all: true })
        const options = responsePackages.data?.map((item) => ({
            value: item.id,
            label: item.name,
        }))

        setPackagesOptions(options)

        const responseClasses = await SERVICES_CLASSES.Models.getClasses({ all: true })

        if (responseClasses?.success) {
            if (responseClasses?.data !== undefined) {
                setClasses(responseClasses?.data)
            }
        }


        const responseAttrs = await SERVICES_ATTRIBUTES.Models.getAttributes({ all: true })

        if (responseAttrs?.success) {
            if (responseAttrs?.data !== undefined) {
                setAttributes(responseAttrs?.data)
            }
        }

        return true
    }

    useEffect(() => {
        setIsLoading(true)
        getSourceData().then(() => {
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        if (filteredClasses?.length > 0) {
            const newColumns: any[] = filteredClasses
                .filter(cl => chosenClassesIds.includes(cl?.id)).map((item, index) => {
                    return {
                        key: `class_${index}`,
                        dataIndex: `class_${item?.id}`,
                        title: item?.name,
                        width: '150px',
                    }
                })

            newColumns.unshift({
                key: 'attribute',
                dataIndex: 'attribute',
                title: 'Аттрибут',
                width: '200px',
            })

            setColumns(newColumns)
        }
    }, [filteredClasses, chosenClassesIds])

    useEffect(() => {
        const rows: any[] = []

        if (filteredAttributes?.length > 0) {
            filteredAttributes.forEach((attr: IAttribute, index) => {

                rows.push({
                    attribute: attr.name,
                    key: `key_${index}`,
                })
                filteredClasses.filter(cl => chosenClassesIds.includes(cl?.id)).forEach((item) => {

                    rows[index][`class_${item?.id}`] = (
                        <Form.Item
                            valuePropName="checked"
                            style={{ margin: '0' }}
                            name={`attribute_${attr?.id}_class_${item?.id}`}
                        >
                            <CheckBox
                                defaultChecked={attr?.classes_ids?.find(cl => cl?.id == item?.id) ?? false}
                            />
                        </Form.Item>
                    )
                })
            })
        }

        setRows(rows)
        setIsClassesLoading(false)
    }, [filteredClasses, filteredAttributes, chosenClassesIds])

    const handleSelect = (e: number) => {
        setIsClassesLoading(true)
        form.setFieldsValue({
            chosenClasses: []
        })
        const filteredClasses = classes.filter((item: any) => item?.package_id == e)
        const filteredAttributes = attributes.filter(
            (item: any) => item?.package_id == e && ['public', 'package'].includes(item.visibility) )

        setFilteredClasses(filteredClasses)
        setFilteredAttributes(filteredAttributes)
    }

    const handleSubmit = async (values: any) => {
        setCompState({ ...compState, isSubmitLoading: true })
        const payload: {
            attribute_id: number,
            classes_ids: number[]
        }[] = []
        const attrToIndex = {}

        attributes.map((attr, index) => {
            attrToIndex[attr.id] = index
            const payloadItem = {
                attribute_id: attr?.id,
                classes_ids: []
            }

            payloadItem.classes_ids = attr?.classes_ids.map( item => item.id)
            payload[index] = payloadItem;
        })

        const filteredClasses2 = filteredClasses.filter( item => chosenClassesIds.includes(item.id))
        const valuesKeys = Object.keys(values);

        filteredAttributes.forEach( (attr) => {
            filteredClasses2.forEach((cl) => {
                const valueKey = `attribute_${attr?.id}_class_${cl?.id}`
                const isKey = valuesKeys.includes(valueKey)

                if (isKey) {
                    const value = values[`attribute_${attr?.id}_class_${cl?.id}`] ?? false
                    const realAttrIndex = attrToIndex[attr.id]

                    if (value) {
                        payload[realAttrIndex].classes_ids.push(cl.id)
                    } else {
                        payload[realAttrIndex].classes_ids.filter( item => item !== cl.id)
                    }

                }
            })
        })

        const response = await SERVICES_ATTRIBUTES.Models.updateAttributesLinks(payload)

        if (response.success) {
            setIsLoading(true)
            getSourceData().then(() => {
                setIsLoading(false)
            })
            setCompState({ ...compState, isSubmitLoading: false })
            message.success('Связи успешно обновлены')
        } else {
            message.error('Ошибка в обновлении связей')
        }
    }

    return (
        <>
            {isLoading ? (
                <Spin size="large" style={{ textAlign: 'center' }} />
            ) : (
                <Row justify="center">
                    <Col span={24}>
                        <Card>
                            <Form labelAlign="left" form={form} onFinish={handleSubmit}>
                                <Row style={{ marginBottom: '20px' }}>
                                    {' '}
                                    <ButtonSubmit loading={compState.isSubmitLoading} color="green" />
                                </Row>
                                <Col span={8}>
                                    <Form.Item name="packages" label="Выберите пакет">
                                        <Select
                                            placeholder="Пакет"
                                            data={packagesOptions}
                                            onSelect={(e) => {

                                                handleSelect(e)

                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="chosenClasses" label="Выберите классы для отображения">
                                        <Select
                                            value={chosenClassesIds}
                                            mode="multiple"
                                            placeholder="Классы"
                                            customData=
                                                {
                                                    {
                                                        data: filteredClasses,
                                                        convert: { valueField: 'id', optionLabelProp: 'name' }
                                                    }
                                                }
                                            onChange={(e) => {

                                                setChosenClassesIds(e)
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    {
                                        isClassesLoading == true ? (
                                            <Spin size="large" style={{ textAlign: 'center' }} />
                                        ) : (

                                            chosenClassesIds?.length > 0 &&
                                            <SimpleTable
                                                scroll={{ x: '400px', y: '70vh' }}
                                                pagination={false}
                                                columns={columns}
                                                rows={rows}
                                            />

                                        )
                                    }
                                </Col>
                            </Form>
                        </Card>
                    </Col>
                </Row>


            )}
        </>
    )
}

export default AttributesLinksFormContainer
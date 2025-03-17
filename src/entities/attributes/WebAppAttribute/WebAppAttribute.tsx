/* eslint-disable max-len */
import { IAttrData, OAttrFormMemo } from '@features/object-attributes/OAttrForm/OAttrForm'
import { selectAttributeByIndex, useAttributesStore } from '@shared/stores/attributes'
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes'
import { selectDataTypes, useDataTypes } from '@shared/stores/dataTypes'
import { IAttribute } from '@shared/types/attributes'
import { Buttons } from '@shared/ui/buttons'
import { DefaultModal2 } from '@shared/ui/modals'
import { SortableList } from '@shared/ui/SortableList'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Col, Collapse, Form, Row } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ATTR_DATA, ATTRIBUTES } from './utils'

interface IWebAppAttribute {
    value?: string
    onChange?: (value: string) => void
    baseClass?: number
}

const WebAppAttribute: FC<IWebAppAttribute> = ({ value, onChange, baseClass  }) => {

    const [attributeData, setAttributeData] = useState<any[]>([])

    const [attrData, setAttrData] = useState<IAttrData[]>([])
    const dataTypes = useDataTypes(selectDataTypes)

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [classAttributes, setClassAttributes] = useState<IAttribute[]>([])
    const [editAttrFieldIndex, setEditAttrFieldIndex] = useState<number | null>(null)

    const getClassIndex = useClassesStore(selectClassByIndex)
    const getAttributeByIndex = useAttributesStore(selectAttributeByIndex)
    const [form] = Form.useForm()

    //*В случае, если есть значение, принимаем их и пробуем распарсить
    useEffect(() => {
        if (value) {
            const jsonString = value
            let jsonData


            try {
                jsonData = JSON.parse(jsonString)
            } catch (error) {
                console.error(`Ошибка парсинга JSON: ${error.message}`)
                // Здесь можно обработать ситуацию с ошибкой
            }
            setAttributeData(Array?.isArray(jsonData) ? jsonData : [])
        }
    }, [])

    useEffect(() => {
        const localClass = getClassIndex('id', baseClass)

        const attributes = localClass?.attributes.map((classAttr) => getAttributeByIndex('id', classAttr?.id))


        //! На данном этапе в случае отсуствия класса харкодим
        setClassAttributes(attributes ?? ATTRIBUTES ?? [])
        const attributesFields: any[] = attributes?.map((attr) => {
            return {
                ...attr,
                currentAmount: attr.multiplicity_left === 0 ? 1 : attr.multiplicity_left,
                minAmount: attr.multiplicity_left,
                maxAmount: attr.multiplicity_right ? attr.multiplicity_right : Infinity,
                objectAttributes: null,
            }
        })

        setAttrData(attributesFields ?? [])
    }, [baseClass])

    const attributes = useMemo(() => {
        const attrObj = {}
        const localClass = getClassIndex('id', baseClass)

        localClass ?  localClass?.attributes.forEach((attr) => (attrObj[attr?.codename] = attr?.name))
            : ATTRIBUTES.forEach((attr) => (attrObj[attr?.codename] = attr?.name))

        return attrObj
    }, [baseClass])

    const createSortItem = (item) => {
        return Object.keys(attributes).map((attr) => {
            return (
                <Col span={8} key={attr}>
                    <b> {attributes[attr]}</b>:{' '}
                    {typeof item[attr] == 'boolean' ? (item[attr] ? 'Да' : 'Нет') : attr ==  'wam_processing_rules' ? parseWamProcessingRulesAttr({ value: item[attr], type: 'code' }) : item[attr]}
                </Col>
            )
        })
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const finalData = attributeData.map(({ id, index, ...obj }) => obj)

        if (onChange) {

            onChange(JSON.stringify(finalData))
        }
    }, [attributeData])

    const handleCancelModal = () => {
        setIsModalVisible(false)
        form.resetFields()
    }

    //*Функция кодирования и декодирования для атрибута wam_processing_rules

    const parseWamProcessingRulesAttr = ({ value, type }: {value: any, type: 'code' | 'decode'}) => {

        if (value !== null) {
            return type == 'code' ? JSON.stringify(value) : JSON.parse(value)
        }
        
        return null
    }

    const onSubmitButtonHandler = (valuesForm) => {
        const values = form.getFieldsValue() ?? valuesForm


        let localAttributesData = [...attributeData]

        if (editAttrFieldIndex !== null) {
            localAttributesData = localAttributesData.map((attr, index) => {
                if (index === editAttrFieldIndex) {
                    const updateAttributeField = Object.keys(attr).reduce((acc, key, index) => {

                        acc[key] =
                            key == 'wam_processing_rules'
                                ? parseWamProcessingRulesAttr({ value: Object.values(values)[index], type: 'decode' })
                                : Object.values(values)[index] ?? null

                        return acc
                    }, {})

                    return updateAttributeField
                }

                return attr
            })
        } else {
            const newAttributeField = {}

            classAttributes.forEach((clAttr) => {
                const value = values[`${clAttr.id}-1`]

                newAttributeField[clAttr.codename] = clAttr.codename == 'wam_processing_rules' ? parseWamProcessingRulesAttr({ value, type: 'decode' }) : value ?? null
            })
            localAttributesData.push(newAttributeField)
        }


        setAttributeData(localAttributesData)
        handleCancelModal()
        setEditAttrFieldIndex(null)
    }

    const editButtonHandler = (index) => {
        const values = attributeData[index]

        classAttributes.forEach((clAttr) => {
            form.setFieldsValue({
                [`${clAttr.id}-1`]: clAttr.codename == 'wam_processing_rules' ? parseWamProcessingRulesAttr({ value: values[clAttr.codename], type: 'code' }) :  values[clAttr.codename],
            })
        })
        setEditAttrFieldIndex(index)
        setIsModalVisible(true)

    }

    const deleteButtonHandler = (index) => {
        const localAttributesData = [...attributeData.slice(0, index), ...attributeData.slice(index + 1)]

        setAttributeData(localAttributesData)
    }



    return (
        <>
            <WrapperCard title="Шаги измерения">
                <Buttons.ButtonAddRow
                    size="large"
                    style={{ marginTop: '10px', marginLeft: '5px' }}
                    onClick={() => {
                        setIsModalVisible(true)
                    }}
                />
                <SortableList
                    items={attributeData?.map((item, index) => ({ ...item, id: uuidv4(), index: index }))}
                    onChange={setAttributeData}
                    renderItem={(item) => (
                        <SortableList.Item id={item?.id} customItemStyle={{ padding: 0, borderRadius: '10px' }}>
                            <SortableList.DragHandle />
                            <Collapse
                                style={{
                                    width: '100%',
                                }}
                                items={[
                                    {
                                        key: '1',
                                        collapsible: 'icon',

                                        label: (
                                            <Row justify="space-between">
                                                {`${item?.wam_request_url ?? 'URL'} [${
                                                    item?.wam_request_method ?? 'Метод'
                                                }]`}
                                                <Row gutter={4} justify="end">
                                                    <Col>
                                                        {' '}
                                                        <Buttons.ButtonEditRow
                                                            onClick={() => editButtonHandler(item.index)}
                                                        />
                                                    </Col>

                                                    <Col>
                                                        {' '}
                                                        <Buttons.ButtonDeleteRow
                                                            withConfirm
                                                            onClick={() => deleteButtonHandler(item.index)}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Row>
                                        ),
                                        children: <Row gutter={[8, 16]}>{createSortItem(item)}</Row>,
                                    },
                                ]}
                            />
                        </SortableList.Item>
                    )}
                />
            </WrapperCard>
            <DefaultModal2
                width="80%"
                showFooterButtons={false}
                destroyOnClose
                open={isModalVisible}
                title="Форма атрибута"
                onCancel={handleCancelModal}
                styles={{
                    body: {
                        marginTop: '20px',
                    },
                }}
            >
                <Form
                    name="form"
                    labelCol={{ span: 8 }}
                    autoComplete="off"
                    form={form}
                    onFinish={(values) => {
                        onSubmitButtonHandler(values)
                    }}
                >
                    <OAttrFormMemo
                        //! На данном этапе в случае отсуствия класса харкодим
                        attributes1={baseClass ? attrData : ATTR_DATA}
                        dataTypes={dataTypes}
                        setAttrData={setAttrData}
                        form={form}
                        objectId={null}
                        classId={baseClass}
                        withoutButtons
                    />

                    <Buttons.ButtonAdd
                        // onClick={onSubmitButtonHandler}
                        color="rgb(92, 184, 92)"
                        customText="Сохранить"
                        icon={null}
                        htmlType="submit"
                    />
                </Form>
            </DefaultModal2>
        </>
    )
}

export default WebAppAttribute
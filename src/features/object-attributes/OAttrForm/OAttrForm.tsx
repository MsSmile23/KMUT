import AttributesFormItem from '@entities/object-attributes/OAttrFormField/OAttrFormField'
import { Col, Collapse, Divider, Form, Row } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { IAttribute } from '@shared/types/attributes'
import { IDataType } from '@shared/types/data-types'
import { IOa } from '@containers/objects/ObjectFormContainer/ObjectFormContainer/ObjectFormContainer'
import { IObjectAttribute } from '@shared/types/objects'
import { UTILS } from '@shared/utils'
import OAttrFieldWrapper from '@features/object-attributes/OAttrForm/OAttrFiedWrapper/OAttrFieldWrapper'
import { getAttributeFieldProps } from '@features/object-attributes/OAttrForm/utils'
import OAShortFieldView from '@entities/object-attributes/OAShortFieldView/OAShortFieldView'
import OAWebApp from '@entities/object-attributes/OAWebApp/OAWebApp'

export interface IAttrData extends IAttribute {
    currentAmount: number
    minAmount: number
    maxAmount: number
    objectAttributes?: IOa[]
}
interface IObjectAttributesForm {
    attributes1: IAttrData[]
    dataTypes: IDataType[]
    setAttrData: React.Dispatch<React.SetStateAction<IAttrData[]>>
    form?: any
    objectId?: number
    classId?: string | number
    withoutButtons?: boolean //*В случае, если нам необходимо поле без кнопок
    setValidation?: React.Dispatch<any>
}

const twoColsMnemos = [ 'multistring', 'wam_processing_rules', 'kmut_get_metric'] 

const OAttrForm: FC<IObjectAttributesForm> = ({ 
    attributes1,
    dataTypes,
    setAttrData,
    form,
    objectId,
    classId,
    withoutButtons = false,
    setValidation }) => {
    const [attrsForRender, setAttrsForRender] = useState<any[]>([])
    const [readOnlyAttrs, setReadOnlyAttrs] = useState<any[]>([])

    const showHint = (item) => {
        const string: string[] = []

        switch (item.inner_type) {
            case 'string':
                string.push(item.view_type_id == 17 ? 'Выберите иконку' : 'Необходимо ввести строку')
                break
            case 'integer':
                string.push('Необходимо ввести целое число')
                break
            case 'boolean':
                string.push('Необходимо выбрать значение')
                break
            case 'double':
                string.push('Необходимо ввести дробное число')
                break
            case 'jsonb':
                string.push('Необходимо ввести значение')
                break
            default:
                string.push('Необходимо ввести строку')
                break
        }

        return item.is_required ? `${string} Внимание! Данное поле обязательно для заполнения` : string
    }

    const addAttributeForm = (id) => () => {
        setAttrData((prev) => {
            const newPrev = [...prev]

            newPrev.forEach((item) => {
                if (item.id == id) {
                    item.currentAmount = item?.currentAmount + 1
                }
            })

            return newPrev
        })
    }
    const deleteAttributeForm = (id, oAId?: number) => () => {
        setAttrData((prev) => {
            const newPrev = [...prev]

            newPrev.forEach((item) => {
                if (item.id == id) {
                    item.currentAmount -= 1

                    if (oAId) {
                        item.objectAttributes = item.objectAttributes.filter((oa) => oa.id !== oAId)
                    }
                }
            })

            return newPrev
        })
    }

    useEffect(() => {
        let attributesForRender = attributes1?.map((attributeObject) => {

            const dataType = attributeObject.data_type 
            ?? dataTypes.find((item) => item.id === attributeObject.data_type_id)

            // attributeObject.data_type = dataType
            const cols = attributeObject?.params?.formLayout?.cols 
            || twoColsMnemos
                .includes(attributeObject?.data_type?.mnemo)
                ? 2
                : 1
            const results = []

            for (let i = 1; i <= attributeObject.currentAmount; i++) {
                const fieldProps = getAttributeFieldProps(attributeObject, dataType, i, classId)

                if (attributeObject?.objectAttributes) {
                    const oa = attributeObject?.objectAttributes[i - 1]

                    const value =
                        oa?.attribute?.data_type.inner_type == 'boolean'
                            ? UTILS.OA.compareOAWithValue(oa as IObjectAttribute, true)
                            : oa?.attribute_value

                    fieldProps.name = oa ? attributeObject.id + '-' + i + '_id' + oa?.id : attributeObject.id + '-' + i

                    form.setFieldsValue({
                        // [item.attribute_id + `-${index2 + 1}`]: check?.attribute_value,
                        [attributeObject.id + '-' + i]: value,
                    })
                }
                results.push(fieldProps)
            }

            return { ...attributeObject, fields: results, settings: { cols } }
        })

        const attributesForRenderReadonly = attributesForRender.filter(
            (attributeObject) => attributeObject.readonly || attributeObject.static_feature
        )

        attributesForRender = attributesForRender.filter((attributeObject) => !attributeObject.readonly)

        // //!ПРОВЕРКА КОМПОЗИТНОГО АТРИБУТА
        // const test = attributesForRender.find(attr => attr.data_type.inner_type == 'jsonb')

        // console.log('Что тут1', attributesForRender, test)

        // if (test) {
        //     attributesForRender.push({ ...test, data_type: { ...test?.data_type, mnemo: 'wam_params' } })
        // }
        // console.log('Что тут', attributesForRender)

        //         //!ПРОВЕРКА КОМПОЗИТНОГО АТРИБУТА
        setAttrsForRender(attributesForRender)
        setReadOnlyAttrs(attributesForRenderReadonly)
    }, [attributes1])

    function sortAttributesBySortField(attributes) {

        // Функция принимает массив атрибутов
        return attributes.sort((a, b) => {
            // Сравниваем поля сортировок
            const attrA =  a?.classes_ids?.find((cl) => cl?.id == classId)?.order || a['sort_order']  ;
            const attrB = b?.classes_ids?.find((cl) => cl?.id == classId)?.order || b['sort_order'] ;

            if (attrA === attrB) {
                return 0;
            }

            if (attrA < attrB) {
                return -1;
            }
            
            return 1;
        });
    }


    const drawAttributes = (attributes) => {
        const baseSpan = 12

        return (
            <Row key={Math.random()} gutter={[8, 8]}>
                {sortAttributesBySortField(attributes).map((attributeObject, index) => (
                    <Col span={attributeObject.settings.cols * baseSpan} key={attributeObject.id + '_col' + index}>
                        {attributeObject.fields.map((attributeField) => (
                            <Row
                                align="middle"
                                key={attributeField.name}
                                gutter={[8, 8]}
                                style={{ marginBottom: '10px' }}
                            >
                                <Col span={24}>
                                    <OAttrFieldWrapper
                                        attrsForRender={attrsForRender}
                                        setAttrsForRender={setAttrsForRender}
                                        attributeObject={attributeObject}
                                        attributeField={attributeField}
                                        addAttributeForm={addAttributeForm}
                                        deleteAttributeForm={deleteAttributeForm}
                                        showHint={showHint}
                                        form={form}
                                        withoutButtons={withoutButtons}
                                    >
                                        <Form.Item
                                            // rules={attributeField.rules}
                                            label=" "
                                            labelCol={{ offset: 0, span: 0 }}
                                            initialValue={attributeField.initialValue}
                                            style={{ margin: 0, width: '100%' }}
                                            colon={false}
                                            name={[attributeField.name]}
                                            valuePropName={attributeField.inner_type == 'boolean' ? 'checked' : 'value'}
                                        >
                                            {
                                                //*Временное решение краткого варианта отображения атриубта в форме
                                                attributeObject?.data_type?.mnemo == 'wam_params' ? (
                                                    <OAWebApp
                                                        form={form}
                                                        attr={attributeObject}
                                                        formItemName={attributeField.name}
                                                        objectView
                                                        modalWidth="70%"
                                                    />
                                                ) : (
                                                    <AttributesFormItem
                                                        attribute={attributeObject}
                                                        viewTypeId={attributeObject.view_type_id}
                                                        dataType={attributeField.inner_type}
                                                        disabled={
                                                            attributeObject.readonly ||
                                                        attributeObject.static_feature != null
                                                        }
                                                        form={form}
                                                        objectId={objectId}
                                                        formItemName={attributeField.name}
                                                        viewType={attributeObject.view_type?.type}
                                                        setValidation = {setValidation}
                                                    />
                                                )
                                            }
                                        </Form.Item>
                                    </OAttrFieldWrapper>
                                </Col>
                            </Row>
                        ))}
                        {attributeObject.name === 'Расписание' && <Divider orientation="center" type="horizontal" />}
                    </Col>
                ))}
            </Row>
        )
    }

    return (
        <>
            {drawAttributes(attrsForRender)}

            {readOnlyAttrs.length > 0 && (
                <>
                    <Divider orientation="left" style={{ fontSize: '13px' }} />
                    <Collapse
                        size="small"
                        style={{ fontSize: '12px' }}
                        defaultActiveKey={['2']}
                        items={[
                            {
                                key: '2',
                                label: 'Не редактируемые атрибуты',
                                children: <>{drawAttributes(readOnlyAttrs)}</>,
                            },
                        ]}
                    />
                </>
            )}
        </>
    )
}

export const OAttrFormMemo = React.memo(OAttrForm)
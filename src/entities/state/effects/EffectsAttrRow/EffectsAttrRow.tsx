import { FC, useEffect, useState } from 'react'
import { IAttributeEffectRow } from '../ManageEffectsBlock/ManageEffectsBlock'
import { Col, Form, FormInstance, Row } from 'antd'
import { Buttons } from '@shared/ui/buttons'
import { Forms, Input } from '@shared/ui/forms'
import AttributesSelect from '@entities/attributes/AttributesSelect/AttributesSelect'
import { availableMnemonicsOptions, incidentActionColumns, incidentUpdateOption, messagesActionColumns, sourceTypeOptions } from '../utils'
import { IAccount } from '@shared/types/accounts'


interface IEffectsAttrRow {
    attr: IAttributeEffectRow
    chosenClassId: number
    index: number
    chosenClasses: number[]
    blockAttributes: IAttributeEffectRow[]
    setBlockAttributes: React.Dispatch<React.SetStateAction<IAttributeEffectRow[]>>
    form:  FormInstance<any>
    value?: any,
    onChange?: (value: any) => void;
    chosenTableType?: string
    disabledForm?: boolean
    accounts: IAccount[]
    chosenActionType: string
}
const EffectsAttrRow: FC<IEffectsAttrRow> = ({ 
    attr,
    chosenClassId,
    index, 
    chosenClasses,
    blockAttributes,
    setBlockAttributes,
    form,
    value, 
    onChange,
    chosenTableType,
    disabledForm,
    accounts,
    chosenActionType
}) => {
    const [chosenCompetitionType, setChosenCompetitionType] = useState<number>(null)
  
    // const createCustomInput = () => {
    //     return (
    //         <Input />
    //     )
    // }
    // const CustomInput: any = createCustomInput() 

   
    const createSourceValueComponent = ({ disabled, filter }: {disabled?: boolean, filter?: string}) => {
        switch (chosenCompetitionType) {
            case 1:
                return (
                    <Input
                        disabled={disabledForm}
                        onChange={(e) => {form.setFieldsValue({
                            [form.getFieldValue(`sourceValue-${attr.parentPseudoId}-${index}`)]: e
                        })}}
                    />)
            case 2:
                return ( 
                    <AttributesSelect
                        disabled={disabledForm}
                        multiType={false}
                        filters={{ class_ids: chosenClasses }}
                        optionsFilterType="interSelect"
                        onChange={(e) => {form.setFieldsValue({
                            [form.getFieldValue(`sourceValue-${attr.parentPseudoId}-${index}`)]: e
                        })}}
                    />
                )
            case 3:
                return (
                    <AttributesSelect
                        disabled={disabledForm}
                        multiType={false}
                        filters={{ class_ids: chosenClasses }}
                        optionsFilterType="interSelect"
                        onChange={(e) => {form.setFieldsValue({
                            [form.getFieldValue(`sourceValue-${attr.parentPseudoId}-${index}`)]: e
                        })}}
                    />
                )
            case 4:
                return (
                    <Forms.Select
                        disabled={disabled || disabledForm} 
                        onChange={(e) => {form.setFieldsValue({
                            [form.getFieldValue(`sourceValue-${attr.parentPseudoId}-${index}`)]: e
                        })}} 
                        data={filter ? availableMnemonicsOptions.filter(item => item.value.includes(filter)) :
                            availableMnemonicsOptions} 
                        searchable={false}
                        allowClear={false}
                    />)
            case 5:
                return (
                    <Forms.Select
                        mode="multiple"
                        disabled={disabled || disabledForm} 
                        onChange={(e) => {form.setFieldsValue({
                            [form.getFieldValue(`sourceValue-${attr.parentPseudoId}-${index}`)]: e
                        })}} 
                        customData={{
                            data: accounts,
                    
                            convert: { valueField: 'id', optionLabelProp: 'login' },
                        }}
                        searchable={false}
                        allowClear={false}
                    />)

            default:
                return <Input disabled placeholder="Необходимо выбрать тип заполнения" />
        }
    }


    useEffect(() => {
        setChosenCompetitionType(form.getFieldValue(`sourceType-${attr.parentPseudoId}-${index}`))
    }, [form.getFieldValue(`sourceType-${attr.parentPseudoId}-${index}`)])

    const deleteAttrHandler = () => {
        const localAttributes = [...blockAttributes]

        setBlockAttributes(localAttributes.filter(attribute => attribute.attrKey !== attr.attrKey))
    }

    useEffect(() => {
        const localBlockAttributes = [...blockAttributes]

        localBlockAttributes.forEach(item => {
            if (item.attrKey == attr.attrKey) {
                item.destination = form.getFieldValue(`destination-${attr.parentPseudoId}-${index}`)
                item.sourceType = form.getFieldValue(`sourceType-${attr.parentPseudoId}-${index}`)
                item.sourceValue = form.getFieldValue(`sourceValue-${attr.parentPseudoId}-${index}`)
            }
        })

        setBlockAttributes(localBlockAttributes)
    }, [form.getFieldValue(`destination-${attr.parentPseudoId}-${index}`),
        form.getFieldValue(`sourceType-${attr.parentPseudoId}-${index}`),
        form.getFieldValue(`sourceValue-${attr.parentPseudoId}-${index}`)
    ]);

    return (
        <Row gutter={16}>
            <Col span={6}>
                <Form.Item
                    required={attr.required}
                    labelCol = {{ span: 10 }}
                    labelAlign="left"
                    label= {chosenTableType ? 'Целевая колонка' : 'Целевой атрибут'}
                    name={`destination-${attr.parentPseudoId}-${index}`}
                >
                    {
                        chosenTableType ? 
                            <Forms.Select
                                disabled = {chosenActionType == 'update_table' ? attr.disabled : true}
                                customData={{
                                    data: chosenTableType == 'incidents' 
                                        ? chosenActionType == 'add_row'
                                            ? incidentActionColumns :
                                            incidentUpdateOption 
                                        : messagesActionColumns,
                                    convert: {
                                        valueField: 'value',
                                        optionLabelProp: 'label',
                                        optionDisabled: 'disabled',
                                    },
                                }}
                                searchable={false}
                                allowClear={false}
                                onChange={(e) => {
                                    setChosenCompetitionType(e)
                                }}
                            /> :
                            <AttributesSelect
                                filters={{ class_ids: [chosenClassId] }}
                                optionsFilterType="interSelect" 
                                multiType={false}
                            />
                    }

                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    required={attr.required}
                    labelCol = {{ span: 10 }}
                    labelAlign="left"
                    label="Источник данных"
                    name={`sourceType-${attr.parentPseudoId}-${index}`}
                >
                    <Forms.Select
                        disabled ={(attr?.disabledSource ?? false) || disabledForm}
                        data={sourceTypeOptions}
                        searchable={false}
                        allowClear={false}
                        onChange={(e) => {
                            setChosenCompetitionType(e)
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item 
                    required={attr.required}
                    labelCol = {{ span: 8 }}
                    labelAlign="left"
                    label="Значение"
                    name={`sourceValue-${attr.parentPseudoId}-${index}`}
                >
                    {createSourceValueComponent(
                        {
                            disabled: attr?.disableMnemo ?? false,
                            filter: attr?.filter
                        }
                    )}
                </Form.Item>
            </Col>
            <Col span={6}>
                <Row gutter={[8, 8]} justify="end">
                    <Col>
                        <Buttons.ButtonDelete
                            size="small"
                            shape="circle"
                            text={false}
                            tooltipText="Удалить блок эффектов"
                            onClick={deleteAttrHandler}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default EffectsAttrRow
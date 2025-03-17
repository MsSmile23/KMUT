import React, { FC, useEffect, useState } from 'react'
import Form, { FormInstance } from 'antd/es/form'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { Col, Row } from 'antd'
import { Forms } from '@shared/ui/forms'
import { createOptions } from '@shared/ui/forms/Select/createOptions'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import { useApi } from '@shared/hooks/useApi'
import { FORM_NAMES } from './data'
import { IAttribute } from '@shared/types/attributes'
import { ButtonsFormRow } from '@shared/ui/buttons/ButtonsFormRow/ButtonsFormRow'
import { SERVICES_STATE_MACHINES } from '@shared/api/State-machines'
import { IClass } from '@shared/types/classes'
import AttributesSelect from '@entities/attributes/AttributesSelect/AttributesSelect'
import { IStateMachinePost } from '@shared/types/state-machines'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { ButtonHelp } from '@shared/ui/buttons'
import { IDataType } from '@shared/types/data-types'


export interface IStateMachineForm<T = any> {
    form?: FormInstance<T>
    id?: string
    formValues?: TFormValues
    setFormValues: React.Dispatch<React.SetStateAction<any>>;
    setIsContinue: React.Dispatch<React.SetStateAction<boolean>>;
    attributesEnable: boolean
    setAttributesEnable: React.Dispatch<React.SetStateAction<boolean>>
    chosenDataType: IDataType
    setChosenDataType: React.Dispatch<React.SetStateAction<IDataType>>

}

export type TFormValues = {
    name: ''
    classes: number[]
    attributes: number[]
    id?: number

}

const StateMachineForm: FC<IStateMachineForm> = ({
    form,
    id,
    formValues,
    setFormValues,
    setIsContinue,
    attributesEnable,
    setAttributesEnable,
    chosenDataType,
    setChosenDataType
}) => {

  
    const [initialValues, setInitialValues] = useState<IStateMachinePost>(null)

    const setFieldsValue = form?.setFieldsValue

    const placeholders = {
        classesPlaceholder: 'Выберете класс(ы)',
        attributesPlaceholder: 'Выберете атрибут(ы)',
        machineNamePlaceholder: 'Введите имя обработчика состояний'
    }

    const classList = useApi<IClass[]>([], getClasses, { all: true });
    const attributes = useAttributesStore(selectAttributes)
    const [selectedClasses, setSelectedClasses] = useState([])

    useEffect(() => {
        const newSelectedClasses = formValues?.classes ?? []

        setSelectedClasses(newSelectedClasses)
    }, [formValues?.classes])


    useEffect(() => {

        if (id !== undefined) {
            SERVICES_STATE_MACHINES.Models.getStateMachineById(id).then((response) => {

                if (!response.data) {
                    return
                }

                const responseData = response.data

                if (response.success) {
                    setInitialValues({
                        name: responseData.name,
                        classes: responseData.classes.map((cl: IClass) => cl.id),
                        attributes: responseData.attributes.map((atr: IAttribute) => atr.id),
                        is_attribute: responseData.attributes.length > 0

                    })
                    responseData.attributes.length > 0 ?  setAttributesEnable(true) : false
                }
            })
        }
    }, [id])


    useEffect(() => {
        setFieldsValue?.(initialValues)
        setFormValues(initialValues)

    }, [initialValues])



    const handleButtonCancel = () => {
        Object.keys(form.getFieldsValue()).forEach((item) => {
            form.setFieldsValue({
                [item]: undefined,
            })
        })
    }

    const handleUndoChangesButton = () => {

        if (initialValues) {
            form.setFieldsValue(initialValues)
        }
        else {
            handleButtonCancel()
        }
    }

    const checkBoxHandler = () => {
        setAttributesEnable(!attributesEnable)

        if (!attributesEnable == false) {
            form.setFieldValue('attributes', [])
        }
    }

    const setAttributeDataType = () => {
        const chosenAttributes = attributes?.filter(attr => form.getFieldValue('attributes')?.includes(attr.id))

        setChosenDataType(chosenAttributes[0]?.data_type
        ?? undefined)
    }

    useEffect(() => {
        setAttributeDataType()
    }, [form.getFieldValue('attributes')])
    

    return (
        <>
            <ButtonsFormRow
                handleCancelButton={handleButtonCancel}
                handleSaveAndGoToListButton={() => {setIsContinue(true)}}
                handleUndoChangesButton={handleUndoChangesButton}
            />
            <Row gutter={[32, 0]} style={{ marginTop: 50 }} align="middle">
                <Col span={24} style={{ display: 'flex' }} >
                    <Col span={3} >Наименование</Col>
                    <Col span={21}>
                        <Form.Item
                            style={{ width: '100%' }}
                            colon={false}
                            name={FORM_NAMES.NAME}
                            rules={[{ required: true, message: 'Обязательное поле' }]}
                        >
                            <Forms.Input placeholder={placeholders.machineNamePlaceholder} />
                        </Form.Item>
                    </Col>

                </Col>

                <Col
                    span={24} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Col span={3}>Класс</Col>
                    <Col span={9}  >
                        <Form.Item
                            colon={false}
                            name={FORM_NAMES.CLASSES}
                            style={{
                                margin: 0
                            }}
                        >
                            <Forms.Select
                                mode="multiple"
                                placeholder={placeholders.classesPlaceholder}
                                options={createOptions(
                                    classList.data
                                        .filter((item) => item.package_id === PACKAGE_AREA.SUBJECT)
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        span={4}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <Form.Item
                            colon={false}
                            valuePropName="checked"
                            name="is_attribute"
                            style={{
                                margin: 0,
                                paddingLeft: 0
                            }}
                        >
                            <Forms.CheckBox
                                onChange={checkBoxHandler} disabled={!formValues?.classes?.length}
                            />
                        </Form.Item>
                        <Col >Автомат атрибута</Col>
                    </Col>
                    <Col
                        span={8}
                        style={{
                            margin: 0,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            padding: 0
                        }}
                    >
                        <Col>Атрибуты</Col>
                        <Col span={17}>
                            <Form.Item
                                style={{ width: '100%', margin: 0 }}
                                colon={false}
                                name={FORM_NAMES.ATTRIBUTES}
                            >
                                <AttributesSelect
                                    filters={{ class_ids: selectedClasses }}
                                    optionsFilterType="interSelect"
                                    disabled={!attributesEnable}
                                    dataType={chosenDataType}
                                    
                                />
                            </Form.Item>
                        </Col>
                        <Col span={1}>
                            <ButtonHelp
                                tooltipText="Можно выбрать только атрибуты одного типа данных"
                            />
                        </Col>
                    </Col>

                </Col>
            </Row>
        </>

    )
}
const MemoStateMachineForm: FC<IStateMachineForm> = React.memo(StateMachineForm)

export default MemoStateMachineForm
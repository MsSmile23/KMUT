/* eslint-disable react/jsx-max-depth */
import LinkedObjects, { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'
import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'
import ColumnsConstructor, { IColumns } from './ColumnsConstructor'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'

type TStateFormType = {
    linkedObjectsForm?: ILinkedObjectsForm
    chosenColumns: IColumns[]
    cableClasses?: any[]
    portClasses?: any[]
    deviceClasses?: any[]
}

export interface WidgetObjectsWithOAStatesFormProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const initialValuesForm = {
    chosenColumns: [],
    cableClasses: [],
    portClasses: [],
    deviceClasses: []
}

const WidgetInterfacesTableForm: FC<WidgetObjectsWithOAStatesFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        setStateForm((prev) => {
            return {
                ...prev,
                ...onChangeForm,
            }
        })
    }

    return (
        <>
            <LinkedObjects 
                getFormValues={(value) => onChangeFormHandler({ linkedObjectsForm: value })} 
                {...settings?.widget?.linkedObjectsForm} 
            />
            <Form
                initialValues={stateForm}
                form={form}
                layout="vertical"
                style={{ width: 800 }}
                onValuesChange={(_, onChangeForm) => {
                    onChangeFormHandler(onChangeForm)
                }}
            >
                <WrapperCard
                    styleMode="replace"
                    bodyStyle={{ padding: '10px' }}
                    title="Блок вывода связанного устройства"
                >
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item label="Классы кабелей" name="cableClasses">
                                <ClassesCascader />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Классы портов устройства" name="portClasses">
                                <ClassesCascader />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Классы связанного устройства" name="deviceClasses">
                                <ClassesCascader />
                            </Form.Item>
                        </Col>
                    </Row>
                </WrapperCard>
                <Form.Item name="chosenColumns">
                    <ColumnsConstructor
                        form={form}
                        targetClasses={settings?.widget?.linkedObjectsForm?.targetClasses}
                    />
                </Form.Item>

            </Form>
        </>
    )
}

export default WidgetInterfacesTableForm
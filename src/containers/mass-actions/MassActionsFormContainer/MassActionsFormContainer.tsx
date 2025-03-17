/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-max-depth */
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard';
import { Col, Form, Input, Row, message } from 'antd';
import { FC, useState } from 'react';
import MassActionsObjectsImportForm from './MassActionsObjectsImportForm';
import MassActionsObjectsExportForm from './MassActionsObjectsExportForm';
import { Buttons } from '@shared/ui/buttons';
import { onSubmit } from './utils';
import { ECSelect } from '@shared/ui/forms';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { selectCheckPermission, useAccountStore } from '@shared/stores/accounts';

interface IMassActionsFormContainer {
    id?: number
}

const MassActionsFormContainer: FC<IMassActionsFormContainer> = () => {

    const [form] = Form.useForm<any>()
    const [loading, setLoading] = useState<boolean>(false)
    const checkPermission = useAccountStore(selectCheckPermission)

    const valuesForm = Form.useWatch([], form)

    const navigate = useNavigate()

    const submitHandler = () => {
        setLoading(true)
        console.log(form.getFieldsValue())
        onSubmit(form.getFieldsValue(), form.resetFields)
            .then(() => {
                message.success('Успешное добавление операции')
                setLoading(false)     
                navigate(`/${ROUTES.MANAGER}/${ROUTES.MASS_ACTIONS}/${ROUTES_COMMON.LIST}`)           
            })
            .catch((err) => {
                message.error(err)
                setLoading(false)
            })
    }

    const typeMassActionsOptions = [
        { value: 'objects-export', label: 'Экспорт объектов', disabled: !checkPermission([
            'get objects', 
            'get classes', 
            'get attributes', 
            'get relations',
        ], 'AND'), },
        { value: 'objects-import', label: 'Импорт объектов' }
    ]

    return (
        <Row justify="center">
            <Col span={24}>
                <WrapperCard>
                    <Form
                        style={{ padding: '10px' }}
                        name="massActionsForm"
                        autoComplete="off"
                        form={form}
                        onFinish={submitHandler}
                        layout="vertical"
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item
                                    label="Название операции"
                                    name={['name']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Название операции" />
                                </Form.Item>
                                <Form.Item
                                    label="Описание"
                                    name={['description']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Описание" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Тип операции"
                                    name={['type']}
                                    rules={[{ required: true }]}
                                >
                                    <ECSelect
                                        options={typeMassActionsOptions}
                                        placeholder="Тип операции"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {!!valuesForm?.type && (
                            valuesForm?.type === 'objects-import'
                                ? <MassActionsObjectsImportForm form={form} />
                                : <MassActionsObjectsExportForm form={form} />)}
                        <Col>
                            <Buttons.ButtonSubmit
                                customText="Сохранить"
                                color="green"
                                disabled={
                                    valuesForm?.type === 'objects-import'
                                        ? loading || !valuesForm?.uploadedFile
                                        : loading || !(valuesForm?.object_selector?.length > 0
                                            || valuesForm?.classes_selector?.length > 0)
                                } />
                        </Col>
                    </Form>
                </WrapperCard>
            </Col>
        </Row>
    )
}

export default MassActionsFormContainer
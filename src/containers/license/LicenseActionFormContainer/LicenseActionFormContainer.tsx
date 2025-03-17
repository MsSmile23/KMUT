import { Buttons } from '@shared/ui/buttons';
import { ECUploadFile } from '@shared/ui/ECUIKit/forms';
import { Col, Row, Form, Modal, Input, message, Space, Tooltip } from 'antd';
import { FC, useState } from 'react';
import { onSubmit } from './utils';
import { responseErrorHandler } from '@shared/utils/common';
import { useLicenseStore } from '@shared/stores/license';
import { ECLoader } from '@shared/ui/loadings';
import { useDebounceCallback } from '@shared/hooks/useDebounce';

const LicenseActionFormContainer: FC = () => {
    const [form] = Form.useForm<any>()
    const [loading, setLoading] = useState<boolean>(false)
    const valuesForm = Form.useWatch('name', form)
    const [disable, setDisable] = useState<boolean>(true)
    const [title, setTitle] = useState<string>('Нечего сохранять')
    const forceUpdate = useLicenseStore(st => st.forceUpdate)

    const submitHandler = () => {
        setLoading(true)
        form.getFieldValue('uploadedFile') !== undefined ?
            onSubmit(form.getFieldValue('uploadedFile'))
                .then((res) => {
                    setDisable(true)

                    if (res.success) {
                        message.success(res.codeMessage);
                        forceUpdate();
                    } else {
                        responseErrorHandler({
                            response: res,
                            modal: Modal,
                            errorText: `Ошибка загрузки лицензии: ${res.status}`,
                        })
                    }  
                    setLoading(false)
                })
                
            : 
            ( 
                message.error('Нет лицензии'),
                setLoading(false)
            )
        setTitle('Нечего сохранять')
        form.resetFields()
    }

    return (
        <Row justify="center">
            <Col span={24}>
                <Form
                    name="licenseLoad"
                    autoComplete="off"
                    form={form}
                    onFinish={submitHandler}
                    layout="vertical"
                    onChange={() => setTitle('Сохранить')}
                >
                    <Row>
                        <Col>
                            <Form.Item
                                label="Добавить лицензию"
                                name="uploadedFile"
                                style={{ width: '150%' }}
                            >   
                                <Space>
                                    {loading ? (
                                        <Tooltip title="Идет загрузка">
                                            <ECLoader
                                                style={{ backgroundColor: 'white', boxShadow: '0 0 2px #f0f2f5' }}
                                                size="large" 
                                            />     
                                        </Tooltip>
                                    ) : ( 
                                        <Tooltip title={title}>
                                            <Buttons.ButtonSubmit
                                                text={false}
                                                disabled={disable}
                                                style={{ backgroundColor: '#1890ff', color: 'white' }} 
                                            />
                                        </Tooltip>)}
                                    <ECUploadFile 
                                        fieldName="uploadedFile"
                                        wordLength={40}
                                        setFieldValue={form.setFieldValue}
                                        mediaFileId={form.getFieldValue('uploadedFile')}
                                        getFieldValue={form.getFieldValue}  
                                        setDisable={setDisable}  
                                        disable={disable}                                  
                                    />
                                    {disable && 
                                        <Tooltip title="Выберите иконку загрузки. Она находится слева">
                                            <Input
                                                placeholder="Пожалуйста, загрузите файл" disabled={true} 
                                                style={{ backgroundColor: 'white', border: 'none' }} 
                                            />
                                        </Tooltip>}
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    )
}

export default LicenseActionFormContainer
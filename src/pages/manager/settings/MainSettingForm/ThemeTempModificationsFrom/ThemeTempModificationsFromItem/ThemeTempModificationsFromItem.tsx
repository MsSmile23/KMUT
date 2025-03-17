/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-len */
import { DeleteOutlined } from '@ant-design/icons'
import { ButtonDeleteRow, Buttons } from '@shared/ui/buttons'
import { ECUploadFile } from '@shared/ui/ECUIKit/forms'
import { ECTooltip } from '@shared/ui/tooltips'
import { Card, Col, Collapse, DatePicker, Form, Input, message, Row, Space, Switch, Tooltip } from 'antd'
import { useState, } from 'react'
import '../cssThemeTempModificationsFrom/holyday.scss'
import { tempModPictireLoading } from '@pages/manager/settings/MainSettingForm/ThemeTempModificationsFrom/themeTempSettings/tempSettings'

const ThemeTempModificationsFromItem = ({ field, form, setDataHoly, dataHoly, remove, onChange }) => {
    const [disable, setDisable] = useState<boolean>(true)
    

    const handleUpload = (key: number, name: number) => {
        const resp = tempModPictireLoading(form.getFieldValue('uploadedFile'))

        resp.then((res) => {
            if (res.success) {
                setDataHoly(prevData => 
                    prevData?.map((item, index) => 
                        index === key ? { ...item, picture: import.meta.env.VITE_API_SERVER + res.data[0].url } : item
                    )
                );
                form.setFieldValue(['pictureAfterSystemTitleList', name, 'pictureAfterTitle'], 
                    import.meta.env.VITE_API_SERVER + res.data[0].url)
                message.success('Файл загружен')
                onChange(form.getFieldValue('pictureAfterSystemTitleList'))
            }
        })
        
        form.setFieldsValue( { uploadedFile: null } )
    }

    const onRemove = (key: number) => {
        const updateData = dataHoly.filter((_, index) => index !== key)

        return setDataHoly(updateData)
    }

    return (
        <Collapse
            style={{ marginTop: '10px', marginBottom: '10px' }}
            items={[
                {
                    key: field.name,
                    label: (
                        <Row
                            gutter={[10, 10]} style={{ display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center' }}
                        >
                            <Col >
                                <Space>
                                    <Col>
                                        <Form.Item 
                                            style={{ margin: 0 }}
                                            name={[field.name, 'name']}
                                        >
                                            <Input
                                                placeholder="Новый праздник" 
                                                bordered={false} disabled={true} 
                                                style={{ color: 'black', opacity: 1 }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Space>
                            </Col>
                            <Col>
                                <Space>
                                    <Col>
                                        <Space >
                                            <Form.Item
                                                style={{ margin: 0, padding: 0 }}
                                                labelCol={{ span: 0, offset: 0 }}
                                                name={[field.name, 'beginning']}
                                            >
                                                <DatePicker
                                                    format="D MMMM"
                                                    placeholder="Начало праздника" 
                                                    className="right-aligned-input"
                                                    bordered={false} disabled={true} 
                                                    suffixIcon={null}
                                                />
                                            </Form.Item>
                                            {' - '}
                                            <Form.Item
                                                style={{ margin: 0, width: '120px' }}
                                                labelCol={{ span: 10, offset: 0 }}
                                                name={[field.name, 'end']}
                                            >
                                                <DatePicker
                                                    format="D MMMM"
                                                    placeholder="Конец праздника" 
                                                    className="bright-disabled-input"
                                                    bordered={false} disabled={true} 
                                                    suffixIcon={null}
                                                        
                                                />
                                            </Form.Item>
                                        </Space>
                                    </Col>
                                    <ECTooltip title="Удаление">
                                        <ButtonDeleteRow
                                            type="link" icon={<DeleteOutlined />}
                                            onClick={() => {
                                                onRemove(field.key);
                                                remove(field.name);
                                            }}
                                        />
                                    </ECTooltip>
                                </Space>
                            </Col>
                        </Row>              
                    ),
                    children: (
                        <Form.Item name={[field.name, 'value']}>                                                                                                                                           
                            <Card >                 
                                <Row 
                                    gutter={[8, 8]} 
                                    style={{ marginTop: '10px', 
                                        display: 'flex', justifyContent: 'space-between' }}
                                >
                                    <Col span={6} style={{ margin: 0 }}>
                                        <Form.Item
                                            style={{ margin: 0, padding: 0 }}
                                            labelCol={{ span: 30, offset: 0 }}
                                            label="Название"
                                            name={[field.name, 'name']}
                                            required={true}
                                        >
                                            <Input placeholder="Название праздника" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ margin: 0 }}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 10, offset: 0 }}
                                            label="Начало"
                                            name={[field.name, 'beginning']}
                                            required={true}
                                        >
                                            <DatePicker 
                                                format="D MMMM" 
                                                style={{ width: '100%' }} 
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ margin: 0 }}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 10, 
                                                offset: 0 }}
                                            label="Конец"
                                            name={[field.name, 'end']}
                                            required={true}                                                                        
                                        >
                                            <DatePicker 
                                                format="D MMMM" 
                                                style={{ width: '100%' }} 
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between'   }} gutter={[8, 8]}>
                                    <Col>
                                        <Space>
                                            <Tooltip
                                                title="Добавьте URL картинки или 
                                            воспользуйтесь нашим загрузчиком. Принимаются файлы следующих форматов: .jpg, .jpeg, .png, .svg"
                                            >
                                                <Form.Item
                                                    style={{ margin: 0 }}
                                                    labelCol={{ span: 40, offset: 0 }}
                                                    label="Изображение"
                                                    name={[field.name, 'pictureAfterTitle']}
                                                    required={true}
                                                >
                                                    <Input 
                                                        placeholder="Отображение картинки" 
                                                    />                                      
                                                </Form.Item>

                                            </Tooltip>
                                            <Form.Item
                                                style={{ margin: 0 }}
                                                labelCol={{ span: 40, offset: 0 }}
                                                label="Загрузить изображение"
                                                name={`pictureLoadingSystemTitle${field.key}`}
                                            >   
                                                <Space>
                                                    <Tooltip
                                                        title={disable ? 'Нечего сохранять. Принимаются файлы следующих форматов: .jpg, .jpeg, .png, .svg' 
                                                            : 'Сохранить'}
                                                    >
                                                        <Buttons.ButtonSubmit
                                                            text={false}
                                                            disabled={disable}
                                                            style={{ backgroundColor: '#1890ff', color: 'white' }}
                                                            onClick={
                                                                (e) => 
                                                                {
                                                                    e.preventDefault()
                                                                    handleUpload(field.key, field.name)
                                                                }
                                                            } 
                                                        />
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <ECUploadFile 
                                                            fieldName="uploadedFile"
                                                            wordLength={20}
                                                            setFieldValue={form.setFieldValue}
                                                            mediaFileId={form.getFieldValue(['pictureAfterSystemTitleList', field.name, 'uploadedFile'])}
                                                            getFieldValue={form.getFieldValue}
                                                            setDisable={setDisable}  
                                                            disable={disable}   
                                                            format={['.jpg', '.jpeg', '.png', '.svg']}
                                                        />
                                                    </Tooltip>
                                                </Space>
                                            </Form.Item>
                                        </Space>
                                    </Col>
                                    <Col>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 40, offset: 0 }}
                                            label="Активно"
                                            name={[field.name, 'holydayStatus']}
                                            required={true}
                                            valuePropName="checked"
                                        >
                                            <Switch />                                            
                                        </Form.Item>

                                    </Col>
                                </Row>
                            </Card>
                        </Form.Item>
                    ),
                },
            ]}
        >          
        </Collapse>
    )
}


export default ThemeTempModificationsFromItem
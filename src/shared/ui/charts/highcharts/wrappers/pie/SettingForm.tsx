/* eslint-disable react/jsx-max-depth */
import { Space, Switch, Radio, Form, Input, Checkbox, Divider, Segmented } from 'antd'
import { FC } from 'react'


export const SettingsForm: FC<{
    getPieSettings: (values) => void
    values: any
}> = ({ getPieSettings, values }) => {

    const [form] = Form.useForm();

    const conditions = {
        isOpen: open,
        isActive: values?.isEnabled,
        isNotCallout: values?.type !== 'callout'
    }
    const { isOpen, isActive, isNotCallout } = conditions

    //styles
    const showIsOpen = {
        display: isOpen ? 'block' : 'none'
    }
    const showIsActive = {
        display: isActive ? 'block' : 'none'
    }
    const showIsNotCallout = {
        display: isActive && isNotCallout ? 'block' : 'none'
    }

    return (
        <div
            style={{
                maxHeight: 500,
                width: 300,
                fontSize: 14,
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <div style={showIsOpen}>
                <Form
                    form={form}
                    layout="vertical"
                    labelCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 8 }}
                    initialValues={{
                        isEnabled: values?.isEnabled ?? false,
                        type: values?.type ?? 'vertical',
                        showNames: values?.showNames ?? true,
                        typeValues: values?.typeValues ?? 'absolute',
                        width: values?.width ?? '200',
                        orientation: values?.orientation ?? 'bottom',
                        units: values?.units ?? ''
                    }}
                    onValuesChange={(_value, values) => {
                        getPieSettings(values)
                    }}
                >
                    <Form.Item 
                        label="Отображение легенды" 
                        valuePropName="checked" 
                        name="isEnabled" 
                        labelCol={{ span: 24 }}
                    >
                        <Switch />
                    </Form.Item>
                    <Divider style={showIsActive} />
                    <Form.Item name="type" hidden={!isActive}>
                        <Radio.Group>
                            <Space direction="vertical">
                                <Radio value="vertical">Вертикальная легенда</Radio>
                                <Radio value="horizontal">Горизонтальная легенда</Radio>
                                <Radio value="callout">Выносная легенда</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                    <Divider style={showIsActive} />
                    <Form.Item name="typeValues" label="Вид значений" hidden={!isActive}>
                        <Radio.Group>
                            <Space direction="vertical">
                                <Radio value="absolute">Абсолютные</Radio>
                                <Radio value="percentage">Процентные</Radio>
                                <Radio value="both">Процентные (абсолютные)</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                    <Divider style={showIsActive} />
                    <Form.Item valuePropName="checked" name="showNames" hidden={!isActive}>
                        <Checkbox>
                            Показать названия в легенде
                        </Checkbox>
                    </Form.Item>
                    <Divider style={showIsActive} />
                    <Form.Item
                        name="units"
                        label="Единицы измерения"
                        hidden={!isActive}
                        labelCol={{ span: 24 }}
                        // style={{ height: 16 }}
                    >
                        <Input.TextArea
                            style={{ height: 16, width: 150 }}
                        />
                    </Form.Item>
                    <Divider style={showIsNotCallout} />
                    <Form.Item
                        label="Длина легенды (px)"
                        name="width"
                        hidden={!isActive || !isNotCallout}
                        labelCol={{ span: 24 }}
                    >
                        <Input
                            type="number"
                            style={{ width: 100 }}
                        />
                    </Form.Item>
                    <Divider style={showIsNotCallout} />
                    <Form.Item
                        label="Расположение легенды"
                        name="orientation"
                        hidden={!isActive || !isNotCallout}
                        labelCol={{ span: 24 }}
                    >
                        <Segmented
                            options={[
                                // { label: 'Лево', value: 'left' },
                                { label: 'Сверху', value: 'top' },
                                // { label: 'Право', value: 'right' },
                                { label: 'Снизу', value: 'bottom' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
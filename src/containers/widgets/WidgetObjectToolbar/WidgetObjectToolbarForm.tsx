/* eslint-disable react/jsx-max-depth */
import { ECSelect } from '@shared/ui/forms'
import { Col, Form, InputNumber, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC } from 'react'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import ListConstructor from './ListConstructor'
import { directionOptions } from './utils'
import { WidgetObjectToolbarProps } from './WidgetObjectToolbar'
import { Input } from 'antd/lib'

export interface WidgetObjectToolbarFormProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget }
}


const WidgetObjectToolbarForm: FC<WidgetObjectToolbarFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm<WidgetObjectToolbarProps>()

    return (
        <Form
            initialValues={{ ...settings?.widget }}
            form={form}
            layout="vertical"
            style={{ width: 1000 }}
            onValuesChange={() => onChangeForm(form.getFieldsValue())}
        >
            <WrapperCard
                styleMode="replace"
                bodyStyle={{ padding: '10px' }}
                title="Настройки тулбара"
            >
                <Row gutter={8}>
                    <Col span={4}>
                        <Form.Item label="Направление" name="direction">
                            <ECSelect options={directionOptions} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Размер кнопок" name="buttonsSize">
                            <InputNumber min={1} />
                        </Form.Item>
                    </Col>
                </Row>
            </WrapperCard>
            <Form.Item name="tools">
                <ListConstructor
                    onChange={(newTools) => { form.setFieldsValue({ tools: newTools }) }}
                    form={form}
                    objId={settings?.vtemplate?.objectId}
                />
            </Form.Item>
        </Form>
    );
}

export default WidgetObjectToolbarForm
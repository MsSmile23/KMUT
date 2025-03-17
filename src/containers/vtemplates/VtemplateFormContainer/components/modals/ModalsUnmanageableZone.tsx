import { Select } from '@shared/ui/forms'
import { Form, Space } from 'antd'
import { FC, useEffect } from 'react';
import { ButtonSettings } from '@shared/ui/buttons';
import { TDataSettingUnmanageZoneTabType } from '../../types/types';

interface ModalsUnmanageZoneprops {
    save: (data: TDataSettingUnmanageZoneTabType) => void,
    value: TDataSettingUnmanageZoneTabType
}

const ModalsUnmanageableZone: FC<ModalsUnmanageZoneprops> = (props) => {

    const { save, value } = props

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            typeEditContent: value.typeEditContent || undefined
        })
    }, [value])

    const onFinish = (values: TDataSettingUnmanageZoneTabType) => {
        save(values)
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '50%' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="typeEditContent"
                    rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                >
                    <Select
                        placeholder="Тип зоны редактора контента"
                        options={[{ label: 'Панель виджетов', value: 2 }]}
                    />
                </Form.Item>
                <Form.Item>
                    <Space align="end" direction="horizontal">
                        <ButtonSettings
                            icon={false}
                            type="primary" htmlType="submit"
                        >
                            Применить
                        </ButtonSettings>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ModalsUnmanageableZone
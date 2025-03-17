import { ButtonSettings } from '@shared/ui/buttons';
import { Select } from '@shared/ui/forms';
import { Form, Space, Switch } from 'antd'
import { FC, useEffect } from 'react';
import { TDataSettingManageZoneTabType } from '../../types/types';

interface ModalsManageZoneprops {
    save: (data: TDataSettingManageZoneTabType) => void,
    value: TDataSettingManageZoneTabType
}

const ModalsManageZone: FC<ModalsManageZoneprops> = (props) => {

    const { save, value } = props

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            typeManageElement: value.typeManageElement || undefined,
            typeEditContent: value.typeEditContent || undefined,
            isMiniHeader: value.isMiniHeader || undefined
        })
    }, [value])

    const onFinish = (values: TDataSettingManageZoneTabType) => {
        save(values)
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '50%' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                {/* <Form.Item
                    name="typeManageElement"
                    rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                >
                    <Select
                        placeholder="Тип управляющих элементов"
                        options={[{ label: 'Вкладки справа', value: 1 }]}
                    />
                </Form.Item>
                <Form.Item
                    name="typeEditContent"
                    rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                >
                    <Select
                        placeholder="Тип зоны редактора контента"
                        options={[{ label: 'Панель виджетов', value: 2 }]}
                    />
                </Form.Item> */}
                <Form.Item
                    label="Отобразить мини-шапку"
                    valuePropName="checked"
                    name="isMiniHeader"
                >
                    <Switch />
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

export default ModalsManageZone
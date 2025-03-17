import { ButtonSettings } from '@shared/ui/buttons'
import { Select } from '@shared/ui/forms'
import { Form, Space } from 'antd'
import { FC, useEffect, useState } from 'react'
import { IDataModalMacroZone, MacroZoneType } from '../../types/types'

interface IModalMacroZoneProps {
    save: (data: IDataModalMacroZone) => void
    value: any
    setIsFullScreenZone?: ((value: boolean) => void)
}

const ModalMacroZone: FC<IModalMacroZoneProps> = (props) => {

    const { save, value, setIsFullScreenZone } = props
    const [form] = Form.useForm()
    const [typeEditContent, setTypeEditContent] = useState(value)

    useEffect(() => {
        form.setFieldsValue({
            typeEditContent: value || undefined,
        })
    }, [value])

    const onFinish = (values) => {
        if (values.typeEditContent === MacroZoneType.FULLSCREEN_ZONE) {
            setIsFullScreenZone(true)
        }
        save(values)
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '50%' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={(changedValues) => {
                    if (changedValues.typeEditContent !== undefined) {
                        setTypeEditContent(changedValues.typeEditContent);
                    }
                }}
            >
                <Form.Item
                    name="typeEditContent"
                    rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                >
                    <Select
                        placeholder="Выберите макро-зону"
                        options={[
                            { label: 'Управляемая зона', value: MacroZoneType.MANAGE_ZONE },
                            { label: 'Неуправляемая зона', value: MacroZoneType.UNMANAGE_ZONE },
                            { label: 'Один виджет на весь контейнер', value: MacroZoneType.FULLSCREEN_ZONE }
                        ]}
                    />
                </Form.Item>
                {typeEditContent === MacroZoneType.MANAGE_ZONE && 
                <Form.Item
                    name="typeTabs"
                >
                    <Select
                        placeholder="Выберите тип управляющих элементов"
                        options={[
                            { label: 'Горизонтальные вкладки', value: 'horizontal' },
                            { label: 'Вертикальные вкладки', value: 'vertical' }
                        ]}
                    />
                </Form.Item>}
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

export default ModalMacroZone
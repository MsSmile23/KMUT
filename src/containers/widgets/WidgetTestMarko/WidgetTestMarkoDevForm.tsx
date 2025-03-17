import { Col, Divider, Form, Row, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'

const { Option } = Select;

type TStateFormType = {
   backColor: string,
   textColor: string,
   fontSize: string
}

const initialValuesForm = {
    backColor: '#ffffff',
    textColor: '#000000',
    fontSize: '16px'
}

const colorOptions = [
    { label: 'Красный', value: '#ff0000' },
    { label: 'Зеленый', value: '#00ff00' },
    { label: 'Синий', value: '#0000ff' },
    { label: 'Черный', value: '#000000' },
    { label: 'Белый', value: '#ffffff' },
    { label: 'Серый', value: '#808080' },
    { label: 'Желтый', value: '#ffff00' },
    { label: 'Фиолетовый', value: '#800080' },
];

const fontSizeOptions = [
    { label: '4px', value: '4px' },
    { label: '8px', value: '8px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '28px', value: '28px' },
    { label: '32px', value: '32px' },
];

export interface WidgetObjectsCountFromProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const WidgetTestMarkoDevForm: FC<WidgetObjectsCountFromProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        if ('backColor' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['backColor']: onChangeForm['backColor'],
                }
            })
        }

        if ('textColor' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['textColor']: onChangeForm['textColor'],
                }
            })
        }

        if ('fontSize' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['fontSize']: onChangeForm['fontSize'],
                }
            })
        }
    }

    return (
        <Form
            initialValues={stateForm}
            form={form}
            layout="vertical"
            style={{ width: 800 }}
            onValuesChange={(_, onChangeForm) => {
                onChangeFormHandler(onChangeForm)
            }}
        >
            <Divider orientation="left" plain>
                 Настройки текста
            </Divider>
            <Row gutter={40}>
                <Col>
                    <Form.Item name="backColor" label="Фон текста">
                        <Select placeholder="Выберите цвет фона">
                            {colorOptions.map(color => (
                                <Option key={color.value} value={color.value}>
                                    {color.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    {' '}
                    <Form.Item name="textColor" label="Цвет текста">
                        <Select placeholder="Выберите цвет текста">
                            {colorOptions.map(color => (
                                <Option key={color.value} value={color.value}>
                                    {color.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    {' '}
                    <Form.Item name="fontSize" label="Размер текста">
                        <Select placeholder="Выберите размер шрифта">
                            {fontSizeOptions.map(size => (
                                <Option key={size.value} value={size.value}>
                                    {size.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default WidgetTestMarkoDevForm
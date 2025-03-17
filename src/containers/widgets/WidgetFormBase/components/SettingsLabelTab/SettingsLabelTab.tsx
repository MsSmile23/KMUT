import { CheckBox, Select } from '@shared/ui/forms'
import { ColorPicker, Form } from 'antd'
import ReactQuill from 'react-quill'
import { FC, useEffect } from 'react';
import { useForm } from 'antd/es/form/Form';
import { labelParamsType } from '@containers/widgets/widget-types';
import 'react-quill/dist/quill.snow.css';

interface SettingsLabelTab {
    onChange: <T>(key: string, value: T) => void
    values: labelParamsType
}

const SettingsLabelTab: FC<SettingsLabelTab> = (props) => {

    const { onChange, values } = props

    const [form] = useForm()

    useEffect(() => {
        form.setFieldsValue({
            ...values
        })
    }, [values])

    return (
        <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 400 }}
            initialValues={values}
            onValuesChange={(changedValues, allValues) => {
                // onChange(allValues)
                if ('title_color' in changedValues) {
                    onChange<string>('title_color', changedValues?.['title_color']?.toHexString())
                } else {
                    const key = Object.keys(changedValues)
                    const type = typeof changedValues?.[key[0]]

                    onChange<typeof type>(key[0], changedValues?.[key[0]])
                }
            }}
        >
            <Form.Item name="title_show" valuePropName="checked">
                <CheckBox>Показать заголовок</CheckBox>
            </Form.Item>
            {(form.getFieldValue('title_show') || values?.title_show) && (
                <>
                    <Form.Item
                        name="title_position"
                        label="Выравнивание"
                    >
                        <Select
                            options={[
                                {
                                    label: 'Влево',
                                    value: 'left'
                                },
                                {
                                    label: 'Посередине',
                                    value: 'center'
                                },
                                {
                                    label: 'Вправо',
                                    value: 'right'
                                }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="title_color"
                        label="Цвет заголовка"
                    >
                        <ColorPicker />
                    </Form.Item>
                    <Form.Item
                        name="title_text"
                        style={{ width: '100%' }}
                    >
                        <ReactQuill
                            theme="snow"
                        // value={optionTitleWidget.title.text}
                        // onChange={handleChange}
                        // readOnly={
                        //     !optionTitleWidget.title.visible
                        // }
                        />
                    </Form.Item>
                </>
            )}
        </Form>
    )
}

export default SettingsLabelTab
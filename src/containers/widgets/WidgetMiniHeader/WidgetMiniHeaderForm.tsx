import { Input } from '@shared/ui/forms'
import { Col, Divider, Form, Row, Switch } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'

type TStateFormType = {
   home: boolean,
   back: boolean
}

const initialValuesForm = {
    home: true,
    back: true

}

export interface WidgetObjectsCountFromProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const WidgetMiniHeaderForm: FC<WidgetObjectsCountFromProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        if ('back' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['back']: onChangeForm['back'],
                }
            })
        }

        if ('home' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['home']: onChangeForm['home'],
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
                Отображение
            </Divider>
            <Row gutter={16}>
                <Col span={4}>
                    <Form.Item name="back" label="Назад" valuePropName="checked">
                        <Switch defaultChecked />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    {' '}
                    <Form.Item name="home" label="Домой" valuePropName="checked">
                        <Switch defaultChecked />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default WidgetMiniHeaderForm
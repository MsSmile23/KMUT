import { Input } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'

type TStateFormType = {
    url: string
}

const initialValuesForm = {
    url: '',
}

export interface WidgetObjectsCountFromProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const WidgetIpCameraForm: FC<WidgetObjectsCountFromProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        if ('url' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['url']: onChangeForm['url'],
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
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="url" label="URL">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default WidgetIpCameraForm
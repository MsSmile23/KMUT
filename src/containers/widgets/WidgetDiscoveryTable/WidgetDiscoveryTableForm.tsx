import { getAttributeStereotypes } from '@shared/api/AttributeStereotypes/Models/getAttributeStereotypes/getAttributeStereotypes'
import { useApi2 } from '@shared/hooks/useApi2'
import { Select } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'

type TStateFormType = {
    hiddenStereoType: string
}

const initialValuesForm = {
    hiddenStereoType: null,
}

export interface WidgetDiscoveryTableFormProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const WidgetDiscoveryTableForm: FC<WidgetDiscoveryTableFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)
    const attributeStereotypes = useApi2(() => getAttributeStereotypes({ all: true }))

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        if ('hiddenStereoType' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['hiddenStereoType']: onChangeForm['hiddenStereoType'],
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
                    <Form.Item name="hiddenStereoType" label="Стереотип скрытия">
                        <Select   
                            customData={{
                                data: attributeStereotypes?.data ?? [],
                                convert: { valueField: 'mnemo', optionLabelProp: 'name' },
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default WidgetDiscoveryTableForm
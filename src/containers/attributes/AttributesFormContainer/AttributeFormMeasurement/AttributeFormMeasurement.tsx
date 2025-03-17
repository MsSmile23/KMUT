import { Forms } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd'

const AttributeFormViewMeasurement = ({ rowStyles, names, attributesProps }) => {
    return (
        <Row {...rowStyles}>
            {[names.historyToCache, names.historyToDb].map((name, index) => (
                <Col key={index} xs={24}>
                    <Form.Item
                        name={attributesProps?.[name].name}
                        rules={attributesProps?.[name].rules}
                        valuePropName="checked"
                        noStyle
                    >
                        <Forms.CheckBox>
                            История изменений в {attributesProps?.[name].label}
                        </Forms.CheckBox>
                    </Form.Item>
                </Col>
            ))}
            <Col xs={24}>
                <Form.Item
                    name={attributesProps.readonly.name}
                    rules={attributesProps.readonly.rules}
                    valuePropName="checked"
                    noStyle
                >
                    <Forms.CheckBox>{attributesProps.readonly.label}</Forms.CheckBox>
                </Form.Item>
            </Col>
        </Row>
    )
}

export default AttributeFormViewMeasurement
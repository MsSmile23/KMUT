import React, { useEffect } from 'react'
import { Form, Input } from 'antd'

const ArtemInput = ({value, onChange}) => {

    const [form] = Form.useForm<any>()
    useEffect(() => {
        if(value) form.setFieldsValue(JSON.parse(value))
    }, [value])

    return (
        <div>
            <Form
                name="internalForm"
                form={form}
                onValuesChange={ (values) => {
                    console.log('ARDEV', values)
                    onChange(JSON.stringify(values))
                    //setShowDiv(values.test)
                }}
            >
                <Form.Item
                    name={['internalInput']}
                >
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}

export default ArtemInput
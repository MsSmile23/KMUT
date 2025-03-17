import React, { useEffect, useState } from 'react'
import { Button, Form } from 'antd'
import { Switch } from '@shared/ui/forms'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { NamePath} from 'rc-field-form/es/interface'
import { boolean } from 'zod'

type TFormFields = {
    test: boolean
}

const formFields: Record<string, NamePath<TFormFields>> = {
    test: ['test']
}

const ArtemSwitchForm = ({value, onChange}) => {

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const object = getObjectByIndex('id', 19130)

    const [form] = Form.useForm<TFormFields>()
    const valuesForm: TFormFields = Form.useWatch<TFormFields>([], form)

    useEffect(() => {
        form.setFieldsValue<TFormFields>({
            test: false
        })
    },[])

    return (
        <div>
            <Form
                name="accountForm"
                form={form}
                onValuesChange={ (values) => {
                    console.log('ARDEV', values)
                    onChange(JSON.stringify(values))
                    //setShowDiv(values.test)
                }}
            >
                <Form.Item
                    label="Активность"
                    name={['test']}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                { valuesForm?.test && <div>Какое то поле по Вкл</div> }

                <Button onClick={() => { form.setFieldValue('test' as NamePath, true)}}>Включить</Button>
            </Form>
            
        </div>
    )
}

export default ArtemSwitchForm
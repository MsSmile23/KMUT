import { Form, Input, Divider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'
import { BreadCrumbsFieldsRender } from './BreadcrumbsFields'
import { IPageHeader, IPage } from './types/WidgetPageHeaderTypes'
import { SERVICES_CONFIG } from '@shared/api/Config'

type stateFormType = {
    widget: IPageHeader,
    vtemplate: {
        objectId?: number
    }
}

interface WidgetHeaderFormProps {
    onChangeForm: <T>(data: T) => void
    settings: stateFormType
}

const initialValues: IPageHeader = {
    name: '',
    breadcrumbs: []
}

export const WidgetPageHeaderForm: FC<WidgetHeaderFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const widget = settings?.widget || initialValues;
    const [form] = useForm()
    const [pages, setPages] = useState<IPage[]>([])

    useEffect(() => {
        SERVICES_CONFIG.Models.getConfigByMnemo('front_pages').then((resp) => {
            if (resp.success) {
                if (resp.data) {
                    setPages(JSON.parse(resp.data.value))
                }
            }
        })
    }, [])


    return (
        <Form
            form={form}
            style={{ width: '100%' }}
            autoComplete="off"
            initialValues={widget || initialValues}
            layout="vertical"
            onValuesChange={(changedValues, values) => {
                onChangeForm(values)
            }}
        >

            <Form.Item name="name" label="Название" style={{ flex: 1, marginBottom: 10 }} rules={[{ required: true }]}>
                <Input type="text" />
            </Form.Item>

            <Divider />

            <Form.Item label="Хлебные крошки" name="breadcrumbs">
                <Form.List name={['breadcrumbs']}>
                    {(fields, { add, remove }) => (
                        <BreadCrumbsFieldsRender
                            fields={fields}
                            addField={add}
                            removeField={remove}
                            form={form}
                            pages={pages}
                            onChangeForm={onChangeForm}
                        />
                    )}
                </Form.List>
            </Form.Item>

            <Divider />

        </Form>
    );
}

export default WidgetPageHeaderForm
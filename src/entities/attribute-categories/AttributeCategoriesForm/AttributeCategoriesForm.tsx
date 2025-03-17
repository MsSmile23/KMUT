import { FC, ReactNode, useEffect } from 'react'
import { Col, Form as AntdForm, FormInstance, Row } from 'antd'
import { Forms } from '@shared/ui/forms'
import { SERVICES_ATTRIBUTE_CATEGORIES } from '@shared/api/AttributeCategories';

interface IAttributeCategoriesForm{
    form: FormInstance<any>,
    id: string | undefined,
    buttons?: ReactNode[]
}
const AttributeCategoriesForm: FC<IAttributeCategoriesForm> = ({
    id,
    buttons = [],
    form
}) => {

    useEffect(() => {
        if (id !== undefined) {
            SERVICES_ATTRIBUTE_CATEGORIES.Models.getAttributeCategoryById(id).then( response => {
                if (response.success) {
                    if (response?.data !== undefined) {
                        form.setFieldsValue({
                            name: response?.data?.name,
                        })
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <AntdForm
            name="form"
            labelCol={{ span: 8 }}
            autoComplete="off"
            form={form}
          
        >
            <Col span={10}>
                <AntdForm.Item
                    label="Категория атрибута"
                    name="name"
                    rules={[{ required: true, message: 'Обязательное поле' }]}
                >
                    <Forms.Input placeholder="Категория атрибута" />
                </AntdForm.Item>
            </Col>
            {buttons && buttons.length > 0 && buttons.map( (button, index) => {
                return (
                    <Row key={index}>
                        {button}
                    </Row>
                )
            })}
        </AntdForm>
    )
}

export default AttributeCategoriesForm
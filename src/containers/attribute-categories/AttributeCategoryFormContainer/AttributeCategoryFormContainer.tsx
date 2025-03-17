import { FC } from 'react'
import { Card, Col, Form, Row } from 'antd'
import AttributeCategoriesForm from '@entities/attribute-categories/AttributeCategoriesForm/AttributeCategoriesForm'

import AttributeCategoriesSubmitButton
    from '@features/attribute-categories/AttributeCategoriesSubmitButton/AttributeCategoriesSubmitButton'

interface IAttributeCategoryFormContainer {
    id?: string
}
const AttributeCategoryFormContainer: FC<IAttributeCategoryFormContainer> = ({ id }) => {
    /*
    const [isButtonsLoading, setIsButtonsLoading] = useState({
        submit: false,
        submitGoBack: false,
        clear: false,
        cancel: false,
    })
     */
    const [form] = Form.useForm()

    return (
        <Row justify="center">
            <Col span={24}>
                <Card>
                    <AttributeCategoriesForm
                        id={id}
                        form={form}
                        buttons={[
                            <AttributeCategoriesSubmitButton
                                key="submit"
                                form={form}
                                id={id}
                            />
                        ]}
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default AttributeCategoryFormContainer
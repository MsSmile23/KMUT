import { Card } from 'antd'
import { FC } from 'react'
import Title from 'antd/es/typography/Title';
import AttributesLinksFormContainer from '@containers/attributes/AttributesLinksFormContainer';
const AttributesLinksPage: FC = () => {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return (
        <>
            <Card>
                <Title level={3}>Таблица связываний атрибутов</Title>{' '}
            </Card>
            <Card style={{ marginTop: '10px' }}>
                <AttributesLinksFormContainer />
            </Card>
        </>
    )
}

export default AttributesLinksPage 
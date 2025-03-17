import AttributeCategoryTableContainer from
    '@containers/attribute-categories/AttributeCategoryTableContainer/AttributeCategoryTableContainer'
import { FC } from 'react'
import { Card, Typography } from 'antd'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'

const { Title } = Typography
const List: FC = () => {

    useDocumentTitle('Таблица атрибутов категории')

    return (
        <>
            <Card>
                <Title level={3}>Таблица атрибутов категории</Title>{' '}
            </Card>
            <Card style={{ marginTop: '10px' }}>
                <AttributeCategoryTableContainer />
            </Card>

        </>
    )

}

export default List
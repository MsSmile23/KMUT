import { FC } from 'react'

import ClassesTableContainer from '@containers/classes/ClassesTableContainer/ClassesTableContainer'
import { Card, Typography } from 'antd';
import { useWindowResize } from '@shared/hooks/useWindowResize';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
const { Title } = Typography

const tableOffset = 400

const List: FC = () => {
    const windowDimensions = useWindowResize()

    useDocumentTitle('Таблица классов')
    
    return (
        <>
            <Card>
                <Title level={3}>Таблица классов</Title>{' '}
            </Card>
            <Card style={{ marginTop: '10px' }}>
                <ClassesTableContainer />
            </Card>
        </>
    )
}

export default List
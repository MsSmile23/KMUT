import RelationTableContainer from '@containers/relations/RelationTableContainer/RelationTableContainer'
import { Card } from 'antd'
import Title from 'antd/es/typography/Title'
import { useWindowResize } from '@shared/hooks/useWindowResize';
import { FC } from 'react';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';

const tableOffset = 320

const List: FC = () => {
    const windowDimensions = useWindowResize()

    useDocumentTitle('Таблица связей')
    
    return (
        <>
            <Card>
                <Title level={3}>Таблица связей</Title>
            </Card>
            <Card style={{ marginTop: 20 }}>
                <RelationTableContainer height={windowDimensions.height - tableOffset} />
            </Card>
        </>
    )
}

export default List
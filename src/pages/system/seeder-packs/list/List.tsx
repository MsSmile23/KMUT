import { Card } from 'antd'
import Title from 'antd/es/typography/Title'
import { FC } from 'react';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import SeederPacksList from '@containers/seeder-packs/SeederPacksList/SeederPacksList';



const List: FC = () => {
    useDocumentTitle('Управление пакетами')
    
    return (
        <>
            <Card>
                <Title level={3}>Управление пакетами</Title>
            </Card>
            <Card style={{ marginTop: 20 }}>
                <SeederPacksList />
            </Card>
        </>
    )
}

export default List
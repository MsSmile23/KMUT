import { FC } from 'react'
import { Card, Typography } from 'antd'
import StateMachineAdminTable from '@entities/state/StateMachineAdminTable/StateMachineAdminTable'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'

const { Title } = Typography
const List: FC = () => {

    
    useDocumentTitle('Таблица обработчиков состояний')

    return (
        <>
            <Card>
                <Title level={3}>Таблица обработчиков состояний</Title>{' '}
            </Card>
            <Card style={{ marginTop: '10px' }}>
                <StateMachineAdminTable />
            </Card>

        </>
    )

}

export default List
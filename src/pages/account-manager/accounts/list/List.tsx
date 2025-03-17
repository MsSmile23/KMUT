import { FC } from 'react'
import { Card } from 'antd'
import { ROUTES } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { PageHeader } from '@shared/ui/pageHeader'
import AccountsTableContainer from '@containers/accounts/AccountsTableContainer/AccountsTableContainer'

const List: FC = () => {
    const title = 'Список аккаунтов'



    useDocumentTitle(title)
    
    return (
        <>
            <PageHeader
                title="Список аккаунтов" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: '/accounts/list',
                        breadcrumbName: 'Аккаунты',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <AccountsTableContainer  />
            </Card>

        </>
    )

}

export default List
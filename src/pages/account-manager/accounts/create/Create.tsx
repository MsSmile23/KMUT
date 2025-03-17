
import { Card } from 'antd'
import { FC } from 'react'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'

import { PageHeader } from '@shared/ui/pageHeader'
import AccountFormContainer from '@containers/accounts/AccountFormContainer/AccountFormContainer'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'



const Create: FC = () => {
    const title = 'Создание аккаунта'



    useDocumentTitle(title)
    
    return (
        <>
            <PageHeader
                title="Создание аккаунта" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: '/accounts/list',
                        breadcrumbName: 'Аккаунты',
                    },
                    {
                        path: `/accounts/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание аккаунта',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <AccountFormContainer  />
            </Card>
        </>
    )
}

export default Create
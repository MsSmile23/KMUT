import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import AccountFormContainer from '@containers/accounts/AccountFormContainer/AccountFormContainer'

const Update: FC = () => {
    const { id } = useParams<{ id?: string }>()

    const title = 'Редактирование аккаунта'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title="Редактирование аккаунта"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: '/accounts/list',
                        breadcrumbName: 'Аккаунты',
                    },
                    {
                        path: `/accounts/${ROUTES_COMMON.UPDATE}/:id`,
                        breadcrumbName: 'Редактирование аккаунта',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <AccountFormContainer id={Number(id)} />
            </Card>
        </>
    )
}

export default Update
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import RoleFormContainer from '@containers/roles/RoleFormContainer/RoleFormContainer'

const Update: FC = () => {
    const { id } = useParams<{ id?: string }>()

    const title = 'Редактирование роли'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title={title}
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.ROLES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Роли',
                    },
                    {
                        path: `/${ROUTES.ROLES}/${ROUTES_COMMON.UPDATE}/:id`,
                        breadcrumbName: 'Редактирование роли',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <RoleFormContainer id={Number(id)} />
            </Card>
        </>
    )
}

export default Update
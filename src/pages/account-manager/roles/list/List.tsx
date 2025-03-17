import { FC } from 'react'
import { Card } from 'antd'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { PageHeader } from '@shared/ui/pageHeader'
import RoleTableContainer from '@containers/roles/RoleTableContainer/RoleTableContainer'

const List: FC = () => {
    const title = 'Список ролей'

    useDocumentTitle(title)
    
    return (
        <>
            <PageHeader
                title={title} routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.ROLES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Роли',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <RoleTableContainer />
            </Card>

        </>
    )

}

export default List
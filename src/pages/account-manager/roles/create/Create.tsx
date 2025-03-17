
import { Card } from 'antd'
import { FC } from 'react'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import RoleFormContainer from '@containers/roles/RoleFormContainer/RoleFormContainer'



const Create: FC = () => {
    const title = 'Создание роли'



    useDocumentTitle(title)
    
    return (
        <>
            <PageHeader
                title="Создание роли" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.ROLES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Роли',
                    },
                    {
                        path: `/${ROUTES.ROLES}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание роли',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>

                <RoleFormContainer />
            
            </Card>
        </>
    )
}

export default Create
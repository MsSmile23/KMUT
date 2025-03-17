import GroupPoliciesFormContainer from '@containers/groupPolicies/GroupPoliciesFormContainer/GroupPoliciesFormContainer'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { PageHeader } from '@shared/ui/pageHeader'
import { Card } from 'antd'
import { FC } from 'react'


const Create: FC = () => {
    const title = 'Создание групповой политики'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title={`${title}`} 
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Групповые политики',
                    },
                    {
                        path: `/${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: `${title}`,
                    }
                ]}
            />
            <Card style={{ marginTop: '10px' }} >
                <GroupPoliciesFormContainer />
            </Card>

        </>
    )
}

export default Create
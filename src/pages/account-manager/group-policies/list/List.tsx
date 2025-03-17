import GroupPoliciesTableContainer from '@containers/groupPolicies/GroupPoliciesTableContainer/GroupPoliciesTableContainer'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { PageHeader } from '@shared/ui/pageHeader'
import { Card } from 'antd'
import { FC } from 'react'


const List: FC = () => {
    const title = 'Групповые политики'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title={`${title}`}
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная'
                    },
                    {
                        path: `/${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: `${title}`
                    }
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <GroupPoliciesTableContainer />
            </Card>
        </>
    )
}

export default List
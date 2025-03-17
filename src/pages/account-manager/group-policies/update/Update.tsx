import GroupPoliciesFormContainer from '@containers/groupPolicies/GroupPoliciesFormContainer/GroupPoliciesFormContainer'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { PageHeader } from '@shared/ui/pageHeader'
import { Card } from 'antd'
import { FC } from 'react'
import { useParams } from 'react-router-dom'


const Update: FC = () => {
    const title = 'Редактирование групповой политики'
    const { id } = useParams<any>()
    
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
                        path: `/${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.LIST}/`,
                        breadcrumbName: 'Групповые политики',
                    },
                    {
                        path: `/${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.UPDATE}/:id`,
                        breadcrumbName: `${title}`,
                    }
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <GroupPoliciesFormContainer id={id} />
            </Card>
        </>
    )
}

export default Update
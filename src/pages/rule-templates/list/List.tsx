import { FC } from 'react'
import { Card } from 'antd'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { PageHeader } from '@shared/ui/pageHeader'
import AccountsTableContainer from '@containers/accounts/AccountsTableContainer/AccountsTableContainer'
import RuleTemplatesTable from '@entities/rule-templates/RuleTemplatesTable/RuleTemplatesTable'

const List: FC = () => {
    const title = 'Шаблоны правил'



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
                        path: `/${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Шаблоны правил',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <RuleTemplatesTable  />
            </Card>

        </>
    )

}

export default List
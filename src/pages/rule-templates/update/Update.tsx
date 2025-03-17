import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import RuleTemplateForm from '@containers/rule-templates/RuleTemplateForm/RuleTemplateForm'

const Update: FC = () => {
    const { id } = useParams<{ id?: string }>()

    const title = 'Редактирование шаблона правил'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title="Редактирование шаблона правил"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Шаблоны правил',
                    },
                    {
                        path: `/${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.UPDATE}/:id`,
                        breadcrumbName: 'Редактирование аккаунта',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <RuleTemplateForm id={Number(id)} />
            </Card>
        </>
    )
}

export default Update

import { Card } from 'antd'
import { FC } from 'react'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'

import { PageHeader } from '@shared/ui/pageHeader'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import RuleTemplateForm from '@containers/rule-templates/RuleTemplateForm/RuleTemplateForm'



const Create: FC = () => {
    const title = 'Создание шаблона правил'



    useDocumentTitle(title)
    
    return (
        <>
            <PageHeader
                title="Создание шаблона правил" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: `/${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Шаблоны правил',
                    },
                    {
                        path: `/${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание шаблона правил',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <RuleTemplateForm   />
            </Card>
        </>
    )
}

export default Create
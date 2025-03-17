import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Outlet } from 'react-router-dom'
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes'
import RuleTemplatesCreate from '@pages/rule-templates/create'
import RuleTemplatesUpdate from '@pages/rule-templates/update'
import RuleTemplatesList from '@pages/rule-templates/list'

const ruleTemplates: ICustomRoute = {
    page: {
        path: ROUTES.RULE_TEMPLATES,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <RuleTemplatesCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <RuleTemplatesUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <RuleTemplatesList />
        },
    ]
}

export const RuleTemplatesRoutes = CustomRoutes(ruleTemplates)
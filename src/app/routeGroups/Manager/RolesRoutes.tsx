import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Outlet } from 'react-router-dom'
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes'
import RoleCreate from '@pages/account-manager/roles/create'
import RoleUpdate from '@pages/account-manager/roles/update'
import RolesList from '@pages/account-manager/roles/list'

const rolesTemplates: ICustomRoute = {
    page: {
        path: ROUTES.ROLES,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <RoleCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <RoleUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <RolesList />
        },
    ]
}

export const RolesRoutes = CustomRoutes(rolesTemplates)
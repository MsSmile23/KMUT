import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes'
import { Outlet } from 'react-router-dom'
import GroupPolicesCreate from '@pages/account-manager/group-policies/create'
import GroupPolicesUpdate from '@pages/account-manager/group-policies/update'
import GroupPolicesList from '@pages/account-manager/group-policies/list'

const GroupPolicesRoutesTemplate: ICustomRoute = {
    page: {
        path: ROUTES.GROUP_POLICIES,
        component: <div><Outlet /></div>
    },
    subPages: [
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <GroupPolicesList />
        },
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <GroupPolicesCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <GroupPolicesUpdate />
        }
    ]
}

export const GroupPolicesRoutes = CustomRoutes(GroupPolicesRoutesTemplate)
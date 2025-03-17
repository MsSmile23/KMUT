import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import AccountsCreate from '@pages/account-manager/accounts/create'
import AccountsUpdate from '@pages/account-manager/accounts/update'
import AccountsList from '@pages/account-manager/accounts/list'
import { CustomRoutes, ICustomRoute } from './CustomRoutes';

const accountRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.ACCOUNTS,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <AccountsCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <AccountsUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <AccountsList />
        },
    ]
}

export const AccountsRoutes = CustomRoutes(accountRoutesList)
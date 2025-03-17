import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import MassActionsList from '@pages/system/mass-actions/list';
import MassActionsCreate from '@pages/system/mass-actions/create';
import MassActionsUpdate from '@pages/system/mass-actions/update';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes';

const massActionsRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.MASS_ACTIONS,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <MassActionsCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <MassActionsUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <MassActionsList />
        },
    ]
}

export const MassActionsRoutes = CustomRoutes(massActionsRoutesList)
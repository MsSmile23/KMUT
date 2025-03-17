import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes';
import List from '@pages/discovery/list';

const discoveryRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.DISCOVERY,
        component: <div><Outlet /></div>,
    },
    subPages: [
        // {
        //     key: 'create',
        //     path: ROUTES_COMMON.CREATE,
        //     component: <Create />
        // },
        // {
        //     key: 'update',
        //     path: `${ROUTES_COMMON.UPDATE}/:id`,
        //     component: <Update />
        // },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <List />
        },
    ]
}

export const DiscoveryRoutes = CustomRoutes(discoveryRoutesList)
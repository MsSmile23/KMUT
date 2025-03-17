import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import SeederPacksList from '@pages/system/seeder-packs/list'
import { CustomRoutes, ICustomRoute } from './CustomRoutes';
import SystemList from '@pages/system/list'

const systemRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.SYSTEM,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'seederPacksList',
            path: 'seeder-packs/' + ROUTES_COMMON.LIST,
            component: <SeederPacksList />
        },
        {
            key: 'seederPacks',
            path: 'seeder-packs',
            component: <SeederPacksList />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <SystemList />
        },
    ]
}

export const SystemRoutes = CustomRoutes(systemRoutesList)
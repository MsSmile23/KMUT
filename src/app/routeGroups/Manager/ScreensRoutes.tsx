import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import ScreensList from '@pages/navigation-settings/screens/list';
import ScreenCreate from '@pages/navigation-settings/screens/create';
import ScreenUpdate from '@pages/navigation-settings/screens/update';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes';

const screensRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.SCREENS,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <ScreenCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <ScreenUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <ScreensList />
        },
    ]
}

export const ScreensRoutes = CustomRoutes(screensRoutesList)
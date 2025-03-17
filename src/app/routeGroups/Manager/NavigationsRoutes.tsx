import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes';
import MenuConstructorList from '@pages/navigation-settings/menu/list'
import PagesList from '@pages/navigation-settings/pages/list'
import ScreensList from '@pages/navigation-settings/screens/list'
import HelpsList from '@pages/navigation-settings/helps/list'

const navigationRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.NAVIGATION,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'menu',
            path: `menu/${ROUTES_COMMON.LIST}`,
            component: <MenuConstructorList />
        },
        {
            key: 'pages',
            path: `${ROUTES.PAGES}/${ROUTES_COMMON.LIST}`,
            component: <PagesList />
        },
        {
            key: 'screens',
            path: `${ROUTES.SCREENS}/${ROUTES_COMMON.LIST}`,
            component: <ScreensList />
        },
        {
            key: 'helps',
            path: `${ROUTES.HELPS}/${ROUTES_COMMON.LIST}`,
            component: <HelpsList />
        },
    ]
}

export const navigationRoutes = CustomRoutes(navigationRoutesList)
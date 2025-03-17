import { ROUTES, ROUTES_SETTINGS } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';

import { CustomRoutes, ICustomRoute } from '@app/routeGroups/Constructor/CustomRoutes';
import * as Pages from '@pages/settings/layout';

const settingsRouteList: ICustomRoute = {
    page: {
        path: ROUTES.SETTINGS,
        component: <div style={{ height: '100%' }}><Outlet /></div>,
    },
    
    subPages: [{
        key: 'layout',
        path: ROUTES_SETTINGS.LAYOUT,
        component: <Pages.LayoutSettings />
    },]
}

export const settingsRoutes = CustomRoutes(settingsRouteList)
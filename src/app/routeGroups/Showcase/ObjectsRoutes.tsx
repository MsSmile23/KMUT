import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';

import { CustomRoutes, ICustomRoute } from '@app/routeGroups/Constructor/CustomRoutes';
import * as Pages from '@pages/objects';


const objectsRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.OBJECTS,
        component: <div><Outlet /></div>,
    },
    
    subPages: [
        {
            key: 'show',
            path: `${ROUTES_COMMON.SHOW}/:id`,
            component: <Pages.Show />
        },
        {
            key: 'list',
            path: `${ROUTES_COMMON.LIST}`,
            component: <Pages.List />
        }, 
        {
            key: 'map',
            path: `${ROUTES.MAP}`,
            component: <Pages.Map />
        },
        {
            key: 'syslog',
            path: `${ROUTES_COMMON.SYSLOG}`,
            component: <Pages.Syslog />
        },
    ]
}

export const ObjectsRoutes = CustomRoutes(objectsRoutesList)
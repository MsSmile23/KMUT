import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import MassActionsList from '@pages/system/mass-actions/list';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes';
import Configuration from '@pages/system/configuration';
import Netflow from '@pages/system/netflow';
import LicenseList from '@pages/system/license/Show';

const systemRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.SYSTEM,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'license',
            path: `${ROUTES.LICENSE}/${ROUTES_COMMON.SHOW}`,
            component: <LicenseList />
        },
        
        {
            key: 'configuration',
            path: ROUTES.CONFIGURATION,
            component: <Configuration />
        },
        {
            key: 'mass-actions',
            path: `${ROUTES.MASS_ACTIONS}/${ROUTES_COMMON.LIST}`,
            component: <MassActionsList />
        },
    ]
}

export const systemRoutes = CustomRoutes(systemRoutesList)
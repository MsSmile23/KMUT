import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes';
import LicenseList from '@pages/system/license/Show';

const LicenseRoutes: ICustomRoute = {
    page: {
        path: ROUTES.LICENSE,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'show',
            path: ROUTES_COMMON.SHOW,
            component: <LicenseList />
        },
    ]
}

export const LicenseRoute = CustomRoutes(LicenseRoutes)
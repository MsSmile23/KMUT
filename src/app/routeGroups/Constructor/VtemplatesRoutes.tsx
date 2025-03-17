import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from './CustomRoutes';
import VtemplatesCreate from '@pages/vtemplates/create'
import VtemplatesList from '@pages/vtemplates/list'
import VtemplatesUpdate from '@pages/vtemplates/update'
import MobileVtemplatesCreate from '@pages/vtemplates/mobile/create'
import MobileVtemplatesUpdate from '@pages/vtemplates/mobile/update'

const vtemplateRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.VTEMPLATES,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <VtemplatesCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <VtemplatesUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <VtemplatesList />
        },
        {
            key: 'mobile-create',
            path: `${ROUTES.MOBILE}/${ROUTES_COMMON.CREATE}`,
            component: <MobileVtemplatesCreate />
        },
        {
            key: 'mobile-update',
            path: `${ROUTES.MOBILE}/${ROUTES_COMMON.UPDATE}/:id`,
            component: <MobileVtemplatesUpdate />
        }
    ]
}

export const VtemplatesRoutes = CustomRoutes(vtemplateRoutesList)
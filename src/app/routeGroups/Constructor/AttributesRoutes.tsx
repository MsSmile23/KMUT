import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import AttributesCreate from '@pages/attributes/create'
import AttributesUpdate from '@pages/attributes/update'
import AttributesList from '@pages/attributes/list'
import { CustomRoutes, ICustomRoute } from './CustomRoutes';
import AttributesLinksPage from '@pages/attributes/links';

const attributeRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.ATTRIBUTES,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <AttributesCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <AttributesUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <AttributesList />
        },
        {
            key: 'links',
            path: ROUTES_COMMON.LINKS,
            component: <AttributesLinksPage />

        }
    ]
}

export const AttributesRoutes = CustomRoutes(attributeRoutesList)
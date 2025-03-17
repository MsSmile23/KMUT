import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Outlet } from 'react-router-dom'
import { CustomRoutes, ICustomRoute } from './CustomRoutes'
import Create from '@pages/relations/create'
import List from '@pages/relations/list'
import Update from '@pages/relations/update'

const relationRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.RELATIONS,
        component: (
            <div>
                <Outlet />
            </div>
        ),
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <Create />,
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <Update />,
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <List />,
        },
    ],
}

export const RelationsRoutes = CustomRoutes(relationRoutesList)
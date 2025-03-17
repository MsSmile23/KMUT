import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Outlet } from 'react-router-dom'
import { CustomRoutes, ICustomRoute } from './CustomRoutes'
import Create from '@pages/state-machine/create'
import List from '@pages/state-machine/list'
import Update from '@pages/state-machine/update'

const stateMachineRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.STATE_MACHINES,
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

export const StateMachinesRoutes = CustomRoutes(stateMachineRoutesList)
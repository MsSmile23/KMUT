import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import ClassesCreate from '@pages/classes/create'
import ClassesUpdate from '@pages/classes/update'
import ClassesList from '@pages/classes/list'
import { CustomRoutes, ICustomRoute } from './CustomRoutes';

const classesRoutesList: ICustomRoute = {
    page: {
        path: ROUTES.CLASSES,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <ClassesCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <ClassesUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <ClassesList />
        },
    ]
}

export const ClassesRoutes = CustomRoutes(classesRoutesList)
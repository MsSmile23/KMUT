import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import AttributeCategoriesCreate from '@pages/attribute-categories/create'
import AttributeCategoriesUpdate from '@pages/attribute-categories/update'
import AttributeCategoriesList from '@pages/attribute-categories/list'
import { CustomRoutes, ICustomRoute } from './CustomRoutes';

const attributesCategoriesList: ICustomRoute = {
    page: {
        path: ROUTES.ATTRIBUTE_CATEGORIES,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'create',
            path: ROUTES_COMMON.CREATE,
            component: <AttributeCategoriesCreate />
        },
        {
            key: 'update',
            path: `${ROUTES_COMMON.UPDATE}/:id`,
            component: <AttributeCategoriesUpdate />
        },
        {
            key: 'list',
            path: ROUTES_COMMON.LIST,
            component: <AttributeCategoriesList />
        },
    ]
}

export const AttributeCategoriesRoutes = CustomRoutes(attributesCategoriesList)
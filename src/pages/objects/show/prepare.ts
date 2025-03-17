import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Объекты',
    },
    {
        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/:id`,
        breadcrumbName: 'Просмотр объекта',
    },
];
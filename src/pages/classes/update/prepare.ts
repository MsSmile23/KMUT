import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Классы',
    },
    {
        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}`,
        breadcrumbName: 'Редактирование класса',
    },
];
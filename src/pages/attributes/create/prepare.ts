import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Атрибуты',
    },
    {
        path: `/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.CREATE}`,
        breadcrumbName: 'Создание атрибута',
    },
];
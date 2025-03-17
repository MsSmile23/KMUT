import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Атрибуты категории',
    },
    {
        path: `/${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.UPDATE}`,
        breadcrumbName: 'Редактирование атрибута категории',
    },
];
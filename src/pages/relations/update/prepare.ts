import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.RELATIONS}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Связи',
    },
    {
        path: `/${ROUTES.RELATIONS}/${ROUTES_COMMON.UPDATE}`,
        breadcrumbName: 'Редактирование связи',
    },
];
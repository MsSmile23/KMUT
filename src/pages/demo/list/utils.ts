import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.DEMO}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Список демо-страниц',
    }
]
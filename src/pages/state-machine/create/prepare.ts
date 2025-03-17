import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Обработчик состояний',
    },
    {
        path: `/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.CREATE}`,
        breadcrumbName: 'Создание обработчика состояний',
    },
];
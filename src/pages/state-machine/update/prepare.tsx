import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`,
        breadcrumbName: 'Обработчики состояний',
    },
    {
        path: `/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.UPDATE}`,
        breadcrumbName: 'Редактирование обработчика состояний',
    },
];
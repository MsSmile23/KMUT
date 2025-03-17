import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=class_id`,
        breadcrumbName: 'Объекты',
    },
    {
        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.CREATE}/:id`,
        breadcrumbName: 'Создание объекта',
    },
];
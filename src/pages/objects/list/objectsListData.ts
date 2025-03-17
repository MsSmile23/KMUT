import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: `/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}/:id?class_id=:classId`,
        breadcrumbName: 'Таблица объектов класса',
    },
];
import { ROUTES } from '@shared/config/paths';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },
    {
        path: `/${ROUTES.OBJECTS}/${ROUTES.MAP}`,
        breadcrumbName: 'Карта объектов',
    },
];
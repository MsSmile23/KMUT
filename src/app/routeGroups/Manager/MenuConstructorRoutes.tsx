import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Outlet } from 'react-router-dom'
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes'
// import MenuConstructorCreate from '@pages/menu-manager/menu/create'
// import MenuConstructorUpdate from '@pages/menu-manager/menu/update'
// import MenuConstructorList from '@pages/menu-manager/menu/list'

const menuConstructor: ICustomRoute = {
    page: {
        path: ROUTES.MENU_CONSTRUCTOR,
        component: <div><Outlet /></div>,
    },
    subPages: [
    //     {
    //         key: 'create',
    //         path: ROUTES_COMMON.CREATE,
    //         component: <MenuConstructorCreate />
    //     },
    //     {
    //         key: 'update',
    //         path: `${ROUTES_COMMON.UPDATE}/:id`,
    //         component: <MenuConstructorUpdate />
    //     },
    //     {
    //         key: 'list',
    //         path: ROUTES_COMMON.LIST,
    //         component: <MenuConstructorList />
    //     },
    ]
}

export const MenuConstructorRoutes = CustomRoutes(menuConstructor)
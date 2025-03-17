import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Outlet } from 'react-router-dom'
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes'
// import PageMenuConsrtuctorList from '@pages/menu-manager/pages/list'
// import PageMenuConsrtuctorCreate from '@pages/menu-manager/pages/create'
// import PageMenuConsrtuctorUpdate from '@pages/menu-manager/pages/update'

export const pageMenuConsrtuctorList: ICustomRoute = {
    page: {
        path: ROUTES.PAGE_MENU_CONSTRUCTOR,
        component: <div><Outlet /></div>,
    },
    subPages: [
        // {
        //     key: 'create',
        //     path: ROUTES_COMMON.CREATE,
        //     component: <PageMenuConsrtuctorCreate />
        // },
        // {
        //     key: 'update',
        //     path: `${ROUTES_COMMON.UPDATE}`,
        //     component: <PageMenuConsrtuctorUpdate />
        // },
        // {
        //     key: 'list',
        //     path: ROUTES_COMMON.LIST,
        //     component: <PageMenuConsrtuctorList />
        // },
    ]
}

export const PageMenuConsrtuctorRoutes = CustomRoutes(pageMenuConsrtuctorList)
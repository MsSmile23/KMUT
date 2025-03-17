import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes'
import MENU_MANAGER from '@pages/navigation-settings'
import { Outlet } from 'react-router'
import { useAccountStore } from '@shared/stores/accounts'

const menuRoutes = [
    {
        key: `main_${ROUTES.MENU}`,
        path: `${ROUTES.MENU}`,
        indexRoute: true,
        component: <MENU_MANAGER.Menu.List />
    },
    {
        key: `create_${ROUTES.MENU}`,
        path: `${ROUTES.MENU}/${ROUTES_COMMON.CREATE}`,
        component: <MENU_MANAGER.Menu.Create />
    },
    {
        key: `update_${ROUTES.MENU}`,
        path: `${ROUTES.MENU}/${ROUTES_COMMON.UPDATE}/:id`,
        component: <MENU_MANAGER.Menu.Update />
    },
    {
        key: `list_${ROUTES.MENU}`,
        path: `${ROUTES.MENU}/${ROUTES_COMMON.LIST}`,
        component: <MENU_MANAGER.Menu.List />
    }
]


const pagesRoutes = [
    {
        key: `main_${ROUTES.PAGES}`,
        path: `${ROUTES.PAGES}`,
        component: <MENU_MANAGER.Pages.List />
    },
    {
        key: `create_${ROUTES.PAGES}`,
        path: `${ROUTES.PAGES}/${ROUTES_COMMON.CREATE}`,
        component: <MENU_MANAGER.Pages.Create />
    },
    {
        key: `update_${ROUTES.PAGES}`,
        path: `${ROUTES.PAGES}/${ROUTES_COMMON.UPDATE}`,
        component: <MENU_MANAGER.Pages.Update />
    },
    {
        key: `list_${ROUTES.PAGES}`,
        path: `${ROUTES.PAGES}/${ROUTES_COMMON.LIST}`,
        component: <div><MENU_MANAGER.Pages.List /></div>
    }
]

const helpsRoutes = [
    {
        key: `main_${ROUTES.HELPS}`,
        path: `${ROUTES.HELPS}`,
        component: <MENU_MANAGER.Helps.List />
    },
    {
        key: `create_${ROUTES.HELPS}`,
        path: `${ROUTES.HELPS}/${ROUTES_COMMON.CREATE}`,
        component: <MENU_MANAGER.Helps.Create />
    },
    {
        key: `update_${ROUTES.HELPS}`,
        path: `${ROUTES.HELPS}/${ROUTES_COMMON.UPDATE}/:id`,
        component: <MENU_MANAGER.Helps.Update />
    },
    {
        key: `list_${ROUTES.HELPS}`,
        path: `${ROUTES.HELPS}/${ROUTES_COMMON.LIST}`,
        component: <MENU_MANAGER.Helps.List />
    }
]

const menuManagerRoutes: ICustomRoute = {
    page: {
        path: ROUTES.NAVIGATION,
        component: <div><Outlet /></div>,
    },
    subPages: [...menuRoutes, ...pagesRoutes, ...helpsRoutes]
}

export const MenuManagerRoutes = CustomRoutes(menuManagerRoutes)
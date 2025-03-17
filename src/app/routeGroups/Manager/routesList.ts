import { ROUTES } from '@shared/config/paths'
import { classesRoutesList } from './ClassesRoutes'
import { discoveryRoutesList } from './DiscoveryRoutes'
import { objectsRoutesList } from './ObjectsRoutes'
import { accountRoutesList } from '../Constructor/AccountsRoutes'
import { pageMenuConsrtuctorList } from './PageMenuConstructorRoutes'
import { devRoutesList } from '../DevRoutes'

export const managerRoutesList = [
    ROUTES.MAIN,
    ...classesRoutesList.subPages.map(subPage => (`${ROUTES.MAIN}${classesRoutesList.page.path}/${subPage.path}`)),
    ...discoveryRoutesList.subPages.map(subPage => (`${ROUTES.MAIN}${discoveryRoutesList.page.path}/${subPage.path}`)),
    ...objectsRoutesList.subPages.map(subPage => (`${ROUTES.MAIN}${objectsRoutesList.page.path}/${subPage.path}`)),
    ...accountRoutesList.subPages.map(subPage => (`${ROUTES.MAIN}${accountRoutesList.page.path}/${subPage.path}`)),
    ...pageMenuConsrtuctorList.subPages
        .map(subPage => (`${ROUTES.MAIN}${pageMenuConsrtuctorList.page.path}/${subPage.path}`)),
    ...devRoutesList,
]
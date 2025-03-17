
import { Outlet, Route } from 'react-router-dom'
import { ObjectsRoutes } from './ObjectsRoutes'
import { DevRoutes } from '../DevRoutes'
import { Main } from '@pages/main'
import { settingsRoutes } from './settingsRoutes'
import IncidentsList from '@pages/incidents/list'
import IncidentsShow from '@pages/incidents/show'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PAGES_INVENTORY } from '@pages/inventory'
import { PAGES_NOTIFICATIONS } from '@pages/notifications'
import { ROUTE_INTERFACE } from '@app/routes/paths'
import { Show } from '@pages/page/show/Show'
import { LicenseRoutes } from '../LicenseRoutes'

export const ShowcaseRoutes = (
    <Route
        path={ROUTE_INTERFACE.SHOWCASE}
        element={<Outlet />}
    >
        <Route
            index
            element={<Main />}
        />
        {ObjectsRoutes}
        <Route path={`${ROUTES.INCIDENTS}`}>
            <Route index element={<Show />} />
            <Route path={`${ROUTES_COMMON.LIST}`} element={<IncidentsList />}></Route>
            <Route path={`${ROUTES_COMMON.SHOW}/:id`} element={<IncidentsShow />}></Route>
        </Route>
        {/* <Route path={ROUTES.INFOPANELS}>
            <Route index element={<Show />} />
            <Route path={`${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/:id`} element={<InfopanelsShow />} />
        </Route> */}
        <Route path={ROUTES.INVENTORY}>
            <Route index element={<Show />} />
            <Route path={`${ROUTES_COMMON.LIST}`} element={<PAGES_INVENTORY.List />} />
        </Route>
        {/* <Route path={`${ROUTES.REPORTS}`}>
            <Route index element={<Show />} />
            <Route path={`${ROUTES_COMMON.LIST}`} element={<PAGES_REPORTS.List />} />
            <Route path={`${ROUTES_COMMON.CREATE}`} element={<PAGES_REPORTS.Create />} />
        </Route> */}
        <Route path={`${ROUTES.NOTIFICATIONS}`}>
            <Route index element={<Show />} />
            <Route path={`${ROUTES_COMMON.LIST}`} element={<PAGES_NOTIFICATIONS.List />} />
        </Route>
        {settingsRoutes}
        {DevRoutes}
        {LicenseRoutes}
        <Route path=":controller" element={<Show />} />
        <Route path=":controller/:method" element={<Show />} />
        <Route path=":controller/:method/:id" element={<Show />} />
    </Route>
)
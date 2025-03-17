import { Outlet, Route } from 'react-router-dom'

import { ObjectsRoutes } from './ObjectsRoutes'
import { DevRoutes } from '../DevRoutes'
import { Main } from '@pages/main'
import { ClassesRoutes } from './ClassesRoutes'
import { AccountsRoutes } from '../Constructor/AccountsRoutes'
import { RuleTemplatesRoutes } from './RuleTemplatesRoutes'
import { DiscoveryRoutes } from './DiscoveryRoutes'
import { PageMenuConsrtuctorRoutes } from './PageMenuConstructorRoutes'
import { MenuConstructorRoutes } from './MenuConstructorRoutes'
import { ROUTE_INTERFACE } from '@app/routes/paths'
import { ThemeSettingsRoutes } from './themeSettingsRoute'
import { MenuManagerRoutes } from './MenuManagerRoutes'
import { MassActionsRoutes } from './MassActiondRoutes'
import { systemRoutes } from './SystemRoutes'
import { navigationRoutes } from './NavigationsRoutes'
import { ScreensRoutes } from './ScreensRoutes'
import { RolesRoutes } from './RolesRoutes'
import { GroupPolicesRoutes } from './GroupPolicesRoutes'
import { LicenseRoute } from './LicenseRoutes'
import { OherRoutes } from './OtherRoutes'

export const ManagerRoutes = (
    <Route
        path={ROUTE_INTERFACE.MANAGER}
        element={<Outlet />}
    >
        <Route 
            index
            element= {<Main />} 
        />
        {ObjectsRoutes}
        {ClassesRoutes}
        {DevRoutes}
        {AccountsRoutes}
        {OherRoutes}
        {RuleTemplatesRoutes}

        {DiscoveryRoutes}
        {MenuManagerRoutes}
        {PageMenuConsrtuctorRoutes}
        {MenuConstructorRoutes}
        {ThemeSettingsRoutes}
        {MassActionsRoutes}
        {LicenseRoute}
        {systemRoutes}
        {navigationRoutes}
        {ScreensRoutes}
        {RolesRoutes}
        {GroupPolicesRoutes}
    </Route>
)
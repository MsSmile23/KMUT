
import { Outlet, Route } from 'react-router-dom';
import { AttributeCategoriesRoutes } from './AttributeCategoriesRoutes';
import { AttributesRoutes } from './AttributesRoutes';
import { ClassesRoutes } from './ClassesRoutes';
import { RelationsRoutes } from './RelationsRoutes';
import { DevRoutes } from '../DevRoutes';
import { Main } from '@pages/main';
import { StateMachinesRoutes } from './StateMachinesRoutes';
import { AccountsRoutes } from './AccountsRoutes';
import { VtemplatesRoutes } from './VtemplatesRoutes';
import { ROUTE_INTERFACE } from '@app/routes/paths';
import { SystemRoutes } from './SystemRoutes';
import { LicenseRoutes } from '../LicenseRoutes';

export const ConstructorRoutes = (
    <Route
        path={ROUTE_INTERFACE.CONSTRUCTOR}
        element={<Outlet />}
    >
        <Route
            index
            element={<Main />}
        />
        {AttributeCategoriesRoutes}
        {AttributesRoutes}
        {ClassesRoutes}
        {RelationsRoutes}
        {DevRoutes}
        {StateMachinesRoutes}
        {AccountsRoutes}
        {VtemplatesRoutes}
        {SystemRoutes}
        {LicenseRoutes}

    </Route>
)
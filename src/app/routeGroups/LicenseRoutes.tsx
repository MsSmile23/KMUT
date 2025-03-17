import LicenseError from '@containers/license/LicenseError/LicenseError'
import { ROUTES } from '@shared/config/paths'
import { Outlet, Route } from 'react-router-dom'

export const LicenseRoutes = (
    <Route path="license" element={<Outlet />}>
        <Route path={ROUTES.ERROR} element={<LicenseError />} />
    </Route>
)
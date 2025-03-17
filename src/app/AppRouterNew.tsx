import { FC } from 'react'
import { AccessProvider, InterfaceProvider, PreloadProvider } from './providers'
import { generalStore } from '@shared/stores/general'

import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { AppProvider } from './AppProvider'
import { routeGroups } from './routeGroups'
import { Aptest } from '@pages/dev/aptest/Aptest'
import PavelDev from '@pages/dev/pavel'
import VtemplateDemo from '@pages/dev/demo/VtemplateDemo/VtemplateDemo'
import Registration from '@pages/public/zond/registration'
import * as DemoPages from '@pages/demo'
/**
 * @param
 * 
 * @returns 
 */

export const AppRouterNew: FC = () => {
    const [interfaceView] = generalStore((state) => [state.interfaceView])
  
    return (
        <Routes>
            {/* Public branch */}
            
            <Route
                path={ROUTES.PUBLIC}
                element={<Outlet />}
            >
                <Route path={`${ROUTES.ZOND}/${ROUTES.REGISTRATION}`} element={<Registration />} />
            </Route>
            <Route
                path={ROUTES.MAIN}
                element={<AppProvider />}
            >
                {/* Auth branch */}
                <Route
                    path={ROUTES.AUTH}
                    element={<Outlet />}
                >
                    <Route path={ROUTES.LOGIN} element={<AccessProvider />} />
                    <Route path={ROUTES.INTERFACEVIEWS} element={<InterfaceProvider />} />
                    <Route path={ROUTES.PRELOAD} element={<PreloadProvider />} />
                </Route>
                
                {/* Main branch */}
                {routeGroups[interfaceView]}

                {/* No match branch */}
                <Route path="dev/paveltest" element={<PavelDev />} />
                <Route path="dev/demo/VtemplateDemo" element={<VtemplateDemo />} />
                <Route
                    path="*"
                    element={<Navigate to={ROUTES.MAIN}></Navigate>}
                />
                <Route path="/dev/aptest" element={<Aptest />} />

                {/* Demo pages */}
                <Route
                    path={ROUTES.DEMO}
                    element={<Outlet />}
                >
                    <Route path={`${ROUTES_COMMON.SHOW}`} element={<DemoPages.Show />} />
                    <Route path={`${ROUTES_COMMON.LIST}`} element={<DemoPages.List />} />
                </Route>
            </Route>
        </Routes>
    )
}
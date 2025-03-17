import AisaevDev from '@pages/dev/aisaev'
import AlekseyDev from '@pages/dev/aleksey'
import AlexTest from '@pages/dev/alex/AlexTest'
import ArtemDev from '@pages/dev/artem'
import BratanovDev from '@pages/dev/bratanov'
import MarkoDev from '@pages/dev/marko/MarkoDev/MarkoDev'
import NikitaDev from '@pages/dev/nikita/nikitaDev/NikitaDev'
import VlDev from '@pages/dev/vl-test/VlDev'
import { VladimirTest } from '@pages/dev/vladimir/VladimirTest'
import { ROUTES } from '@shared/config/paths'
import { Outlet, Route } from 'react-router-dom'

export const DevRoutes = (
    <Route
        path="dev"
        // path={ROUTES.DEV}
        element={<Outlet />}
    >
        <Route path={ROUTES.ARTEM} element={<ArtemDev />} />
        <Route path={ROUTES.ALEX} element={<AlexTest />} />
        <Route path={ROUTES.AISAEV} element={<AisaevDev />} />
        <Route path={ROUTES.VLADIMIR} element={<VladimirTest />} />
        <Route path={ROUTES.VL} element={<VlDev />} />
        <Route path={ROUTES.ALEKSEY} element={<AlekseyDev />} />
        <Route path={ROUTES.BRATANOV} element={<BratanovDev />} />
        <Route path={ROUTES.NIKITA} element={<NikitaDev />} />
        <Route path={ROUTES.MARKO} element={<MarkoDev />} />
    </Route>
)

export const devRoutesList = [
    `${ROUTES.MAIN}${ROUTES.DEV}/${ROUTES.ARTEM}`,
    `${ROUTES.MAIN}${ROUTES.DEV}/${ROUTES.ALEKSEY}`,
    `${ROUTES.MAIN}${ROUTES.DEV}/${ROUTES.ALEX}`,
    `${ROUTES.MAIN}${ROUTES.DEV}/${ROUTES.VLADIMIR}`,
    `${ROUTES.MAIN}${ROUTES.DEV}/${ROUTES.BRATANOV}`,
    `${ROUTES.MAIN}${ROUTES.DEV}/${ROUTES.NIKITA}`,
    `${ROUTES.MAIN}${ROUTES.DEV}/${ROUTES.MARKO}`,
]
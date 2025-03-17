import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { Outlet } from 'react-router-dom';
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes';
import NetflowTableContainer from '@containers/netflow/NetflowTableContainer/NetflowTableContainer';
import { SystemLogTable } from '@entities/stats/SystemLogTable/SystemLogTable';
import { DiscoveryTableContainer } from '@containers/discovery';
import DiscoveryList from '@pages/other/discovery/list';
import SyslogList from '@pages/other/syslog/list';
import NetflowList from '@pages/other/netflow/list';

const otherRouteList: ICustomRoute = {
    page: {
        path: ROUTES.OTHER,
        component: <div><Outlet /></div>,
    },
    subPages: [
        {
            key: 'discovery',
            path: `${ROUTES.DISCOVERY}/${ROUTES_COMMON.LIST}`,
            component: <DiscoveryList />
        },
        {
            key: 'syslog',
            path: `${ROUTES_COMMON.SYSLOG}/${ROUTES_COMMON.LIST}`,
            component: <SyslogList />
        },
        {
            key: 'netflow',
            path: `${ROUTES.NETFLOW}/${ROUTES_COMMON.LIST}`,
            component: <NetflowList />
        },
    ]
}


export const OherRoutes = CustomRoutes(otherRouteList)
import { FC } from 'react'

import { Card } from 'antd';
import { PageHeader } from '@shared/ui/pageHeader';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { DiscoveryTableContainer } from '@containers/discovery';

const List: FC = () => {
    return (
        <>
            <PageHeader
                title="Дискавери"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.INCIDENTS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Дискавери',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <DiscoveryTableContainer />
            </Card>
        </>
    )
}

export default List
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES } from '@shared/config/paths';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { Card } from 'antd';
import { FC } from 'react';
import NetflowTableContainer from '@containers/netflow/NetflowTableContainer/NetflowTableContainer';
import { SystemLogTable } from '@entities/stats/SystemLogTable/SystemLogTable';


const List: FC = () => {
    const title = 'Системный журнал'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title="Системный журнал" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: ROUTES.NETFLOW,
                        breadcrumbName: 'Системный журнал',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <SystemLogTable />
            </Card>
        </>
    )
}

export default List
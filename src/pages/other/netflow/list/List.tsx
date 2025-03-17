import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES } from '@shared/config/paths';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { Card } from 'antd';
import { FC } from 'react';
import NetflowTableContainer from '@containers/netflow/NetflowTableContainer/NetflowTableContainer';

const List: FC = () => {
    const title = 'Анализ трафика'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title="Анализ трафика" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: ROUTES.NETFLOW,
                        breadcrumbName: 'Анализ трафика',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <NetflowTableContainer />
            </Card>
        </>
    )
}

export default List
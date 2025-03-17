import { PageHeader } from '@shared/ui/pageHeader'
import { MassActionsTableContainer } from '@containers/mass-actions/';
import { ROUTES } from '@shared/config/paths';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { Card } from 'antd';
import { FC } from 'react';

const List: FC = () => {
    const title = 'Массовые операции'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title="Массовые операции" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: '/mass-actions/list',
                        breadcrumbName: 'Массовые операции',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <MassActionsTableContainer />
            </Card>
        </>
    )
}

export default List
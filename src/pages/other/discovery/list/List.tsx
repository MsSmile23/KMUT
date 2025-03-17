import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES } from '@shared/config/paths';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { Card } from 'antd';
import { FC } from 'react';
import { DiscoveryTableContainer } from '@containers/discovery';


const List: FC = () => {
    const title = 'Найденные устройства'

    useDocumentTitle(title)

    return (
        <>
            <PageHeader
                title="Найденные устройства" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: ROUTES.DISCOVERY,
                        breadcrumbName: 'Устройства',
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
import { FC } from 'react'

import { Card } from 'antd';
import { PageHeader } from '@shared/ui/pageHeader';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import MenuTable from '@pages/navigation-settings/menu/components/MenuTable/MenuTable';


const List: FC = () => {
    return (
        <>
            <PageHeader
                title="Список сконструированных меню"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.MENU_MANAGER}/${ROUTES.MENU}`,
                        breadcrumbName: 'Список сконструированных меню',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <MenuTable />
            </Card>
        </>
    )
}

export default List
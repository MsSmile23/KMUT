import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { FC } from 'react'
import { PagesManagerTable } from '@pages/navigation-settings/pages/components/PagesManagerTable/PagesManagerTable'
import { Card } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'

const List: FC = () => {
    return (
        <>
            <PageHeader
                title="Страницы"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.MENU_MANAGER}/${ROUTES.PAGES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Страницы',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <PagesManagerTable />
            </Card>
        </>
    )
}

export default List
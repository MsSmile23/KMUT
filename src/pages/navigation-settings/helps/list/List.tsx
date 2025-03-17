import { FC } from 'react'
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths.ts'
import { Card } from 'antd'
import HelpsTable from '@entities/helps/HelpsTable/HelpsTable'


const List: FC = () => {

    return (
        <>
            <PageHeader
                title="Список справок"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.MENU_MANAGER}/${ROUTES.HELPS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Список справок',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <HelpsTable />
            </Card>
        </>
    )
}

export default List
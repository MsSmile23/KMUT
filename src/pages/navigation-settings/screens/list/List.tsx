import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { FC } from 'react'
import { Card } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import ScreensTable from '../components/ScreensTable/ScreensTable'

const List: FC = () => {
    return (
        <>
            <PageHeader
                title="Экраны"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `${ROUTES.SCREENS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Экраны',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <ScreensTable />
            </Card>
        </>
    )
}

export default List
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import { Card } from 'antd'
import { FC } from 'react'
import HelpsForm from '@entities/helps/HelpsForm/HelpsForm'


const Create: FC = () => {
    return (
        <>
            <PageHeader 
                title="Создание справки"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `${ROUTES.NAVIGATION}/${ROUTES.HELPS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Справки',
                    },
                    {
                        path: `${ROUTES.NAVIGATION}/${ROUTES.HELPS}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание справки',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <HelpsForm />
            </Card>
        </>
    )
}

export default Create
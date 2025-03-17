import { Card } from 'antd'
import { FC } from 'react'

import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import PagesManagerForm from '@pages/navigation-settings/pages/components/PagesManagerForm/PagesManagerForm';

const Create: FC = () => {
    return (
        <>
            <PageHeader 
                title="Создание страницы"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Страницы',
                    },
                    {
                        path: `${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание страницы',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <PagesManagerForm />
            </Card>
        </>
    )
}

export default Create
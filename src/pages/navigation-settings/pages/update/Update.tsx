import { Card } from 'antd'
import { FC } from 'react'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import PagesManagerForm from '@pages/navigation-settings/pages/components/PagesManagerForm/PagesManagerForm';


const Create: FC = () => {
    return (
        <>
            <PageHeader 
                title="Редактирование страницы"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Меню и страницы',
                    },
                    {
                        path: `/${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.UPDATE}`,
                        breadcrumbName: 'Редактирование страницы',
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
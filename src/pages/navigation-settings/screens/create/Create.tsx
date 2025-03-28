import { Card } from 'antd'
import { FC } from 'react'

import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import ScreenForm from '../components/ScreenForm/ScreenForm';

const Create: FC = () => {
    return (
        <>
            <PageHeader 
                title="Создание экрана"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.SCREENS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Экраны',
                    },
                    {
                        path: `/${ROUTES.SCREENS}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание экрана',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <ScreenForm />
            </Card>
        </>
    )
}

export default Create
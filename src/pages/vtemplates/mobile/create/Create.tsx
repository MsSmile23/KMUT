import VtemplateMobileForm from '@app/vtemplateMobile/VtemplateMobileForm'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import { Card } from 'antd'
import { FC } from 'react'


const Create: FC = () => {
    return (
        <div
            style={{ 
                height: '100%', 
                margin: 10,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <PageHeader
                title="Создание макета МП"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Таблица визуальных макетов',
                    },
                    {
                        path: `/${ROUTES.VTEMPLATES}/${ROUTES.MOBILE}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание макета МП',
                    },
                ]}
            />
            <Card
                style={{ marginTop: '10px', flex: 1 }}
                bodyStyle={{ height: '100%' }}
            >
                <VtemplateMobileForm />
            </Card>
        </div>
    )
}

export default Create
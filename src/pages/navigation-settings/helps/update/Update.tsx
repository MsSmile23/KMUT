import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { PageHeader } from '@shared/ui/pageHeader'
import { Card } from 'antd'
import { FC } from 'react'
import HelpsForm from '@entities/helps/HelpsForm/HelpsForm'
import { useParams } from 'react-router-dom'


const Update: FC = () => {
    const { id } = useParams<{ id?: string }>()

    return (
        <>
            <PageHeader 
                title="Редактирование справки"
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
                        path: `/${ROUTES.NAVIGATION}/${ROUTES.HELPS}/${ROUTES_COMMON.UPDATE}/:id`,
                        breadcrumbName: 'Редактирование справки',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <HelpsForm id={id} />
            </Card>
        </>
    )
}

export default Update

import { Card } from 'antd'
import { FC } from 'react'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'

import { PageHeader } from '@shared/ui/pageHeader'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import MassActionsFormContainer from '@containers/mass-actions/MassActionsFormContainer/MassActionsFormContainer'



const Create: FC = () => {
    const title = 'Создание массовой операции'



    useDocumentTitle(title)
    
    return (
        <>
            <PageHeader
                title="Создание массовой операции" routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },

                    {
                        path: '/mass-actions/list',
                        breadcrumbName: 'Массовые операции',
                    },
                    {
                        path: `/mass-actions/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание массовой операции',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px' }}>
                <MassActionsFormContainer  />
            </Card>
        </>
    )
}

export default Create
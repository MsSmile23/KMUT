import { FC, useState } from 'react'
import { Card } from 'antd'
import VtemplateFormContainer from '@containers/vtemplates/VtemplateFormContainer/VtemplateFormContainer'
import { PageHeader } from '@shared/ui/pageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'

const Create: FC = () => {

    const [isFullScreenZone, setIsFullScreenZone] = useState<boolean>(false)

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
                title="Создание макета"
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
                        path: `/${ROUTES.VTEMPLATES}/${ROUTES_COMMON.CREATE}`,
                        breadcrumbName: 'Создание макета',
                    },
                ]}
            />
            <Card
                style={isFullScreenZone ? {
                    marginTop: '10px', 
                    flex: 1, 
                    height: '100%'
                } : { marginTop: '10px', flex: 1 }}
                bodyStyle={isFullScreenZone ? { height: 'calc(100% - 100px)' } : { height: '100%' }}
            >
                <VtemplateFormContainer setIsFullScreenZone={setIsFullScreenZone} />
            </Card>
        </div>
    )
}

export default Create
import { FC } from 'react'

import { Card } from 'antd';
import { PageHeader } from '@shared/ui/pageHeader';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { IncidentTableContainer2 } from '@entities/incidents/IncidentTableContainer/IncidentTableContainer2';

const List: FC = () => {
    return (
        <>
            <PageHeader
                title="Инциденты"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.INCIDENTS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Инциденты',
                    },
                ]}
            />
            <Card style={{ marginTop: '10px', background: 'transparent' }}>
                <IncidentTableContainer2 
                    attributeIds={{
                        manufacturer: 10046,
                    }}
                    chosenColumns={['name', 'attempts', 'sync_status', 'last_sync_date', 'task_state_date', 'url']}
                    hideChosenColumns
                />
            </Card>
        </>
    )
}

export default List
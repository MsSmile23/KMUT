import { ForumIncident } from '@containers/vtemplates/forum/ForumIncident'
import { getIncidentById } from '@shared/api/Incidents'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useApi2 } from '@shared/hooks/useApi2'
import { PageHeader } from '@shared/ui/pageHeader'
import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const Show: FC = () => {
    const { id } = useParams()

    const incident = useApi2(getIncidentById, { onmount: 'item' })

    useEffect(() => {
        if (id) {
            incident.request(Number(id))
        }
    }, [incident.request, id])

    return (
        <>
            <PageHeader
                title={incident.data?.name}
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                
                    {
                        path: `/${ROUTES.INCIDENTS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Инциденты',
                    },
                    {
                        path: `/${ROUTES.INCIDENTS}/${ROUTES_COMMON.SHOW}/:id`,
                        breadcrumbName: 'Просмотр инцидента',
                    },
                ]} 
            />
            <div style={{ marginTop: 20 }}></div>
            <ForumIncident incidentId={Number(id)} initialIncident={incident.data} />
        </>
    )
}
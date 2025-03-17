import { getIncidents } from '@shared/api/Incidents'
import { useApi2 } from '@shared/hooks/useApi2'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { useEffect, useMemo } from 'react'
import { createMonitoringObjectName, findParentName } from '../IncidentTableContainer/utils'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { findChildObjects_TEST } from '@shared/utils/objects'
import { Link } from 'react-router-dom'
import { getURL } from '@shared/utils/nav'
import { getLocalTimeFromUTC } from '@shared/utils/datetime'
import { calcDuration2, incidentColumns, incidentStatuses } from './prepare'
import { classesGroups, forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { useGetObjects } from '@shared/hooks/useGetObjects'


//TODO В дальнейшем использовать filter и map в остальных таблицах, где настраиваются столбцы из виджета
const prepareColumns = (hide_attr, incidentColumns, editColumns) => {
    return (hide_attr
        ? incidentColumns.filter(el => el.key !== 'buildings' && el.key !== 'favor' && el.key !== 'services')
        : incidentColumns
    )
        .filter(column => {
        // Если editColumns не определён, считаем, что все колонки доступны
            if (!editColumns) {return true;}
            
            return editColumns[`${column.dataIndex}_available`];
        })
        .map(column => ({
            ...column,
            visible: editColumns ? editColumns[`${column.dataIndex}_default`] : true, // По умолчанию все видимые
        }));
};


const IncidentTableServerFiltration = ({ objectIds, rowPerPage, hide_attr, editColumns }) => {
    const incidents = useApi2(
        (payload?: any) => getIncidents((payload || {})),
        { onmount: false },
    )

    const findObject = useObjectsStore((st) => (id: number) => st.getByIndex('id', id))
    const objects = useGetObjects()

    const rows = useMemo(() => {
        return incidents?.data?.map((incident) => {
            const monitoringObject = findObject(incident?.object_id)
            const parents = findChildObjects_TEST({
                objects,
                object: monitoringObject,
                targetClasses: [
                    ...classesGroups.buildings,
                    ...classesGroups.rooms,
                    ...classesGroups.floors,
                    ...classesGroups.racks,
                    ...classesGroups.units,
                    ...forumThemeConfig.classesGroups.devices,
                    ...forumThemeConfig.classesGroups.favor,
                    ...forumThemeConfig.classesGroups.services
                ]
            })

            const incidentUrl = incident.kmut_url !== null ? incident.kmut_url : ''

            return {
                ...incident,
                key: `incident-row-${incident.id}`,
                monitoringObject: createMonitoringObjectName(findObject(incident?.object_id)),
                // monitoringObject: createMonitoringObjectName(findObject(incident?.object_id), {
                //     manufacturer: attributeIds?.manufacturer,
                //     model: attributeIds?.model,
                // }),
                ...(['buildings', 'favor', 'services'].reduce((hash, key) => ({
                    ...hash, [key]: findParentName(parents, key)
                }), {})),
                url: <Link to={getURL(incidentUrl, 'showcase')} target="_blank">{incidentUrl}</Link>,
                sync_status: incidentStatuses?.[`${incident?.sync_status}`],
                started_at: getLocalTimeFromUTC(incident?.started_at),
                finished_at: getLocalTimeFromUTC(incident?.finished_at),
                finished: incident?.finished_at ? 'Закрыт' : 'Открыт',
                duration: `${calcDuration2(
                    getLocalTimeFromUTC(incident.started_at),
                    incident.finished_at ? getLocalTimeFromUTC(incident.finished_at) : undefined
                )}`,
            }
        })
    }, [objectIds, incidents?.data])

    const columns = useMemo(() => prepareColumns(
        hide_attr,
        incidentColumns,
        editColumns
    ),
    [hide_attr, incidentColumns, editColumns]);

    return (
        <EditTable
            columns={columns}
            tableId="system-log-table"
            rows={rows}
            // scroll={{ x: 2000 }}
            loading={incidents.loading}
            paginator={{
                page: Number(incidents.pagination.currentPage || 1),
                pageSize: rowPerPage,
                total: Number(incidents.pagination.total),
                enablePageSelector: true,
            }}
            server={{
                request: async ({ filterValue, ...meta }) => {
                    const payload = {
                        ...meta,
                        'filter[object_id]': objectIds || ''
                        // filters: {
                        //     object_id: objectIds
                        // }
                    }

                    return incidents.request(payload)
                },
                filter: async (config) => {
                    const payload = {
                        ...config,
                        per_page: config?.pageSize,
                        'filter[object_id]': [...objectIds, config['filter[object_id]'] || ''] 
                        // filters: {
                        //     object_id: objectIds
                        // }
                    }

                    delete payload?.pageSize
                    delete payload?.value

                    for (const param in payload) {
                        if (payload[param] === undefined) {
                            delete payload[param]
                        }
                    }

                    return incidents.request(payload)
                }
            }}
        />
    )
}

export default IncidentTableServerFiltration
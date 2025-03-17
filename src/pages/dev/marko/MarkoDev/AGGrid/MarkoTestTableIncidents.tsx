import { ButtonCreatable } from "@shared/ui/buttons"
import { FC, useMemo, useState, } from "react"
import { useClassesStore } from "@shared/stores/classes";
import { useApi2 } from "@shared/hooks/useApi2";
import { getPackages } from "@shared/api/Packages/Models/getPackages/getPackages";
import { getClassStereotypes } from "@shared/api/ClassStereotypes/Models/getClassStereotypes/getClassStereotypes";
import { useNavigate } from "react-router-dom";
import { IClass } from "@shared/types/classes";
import { VISIBILITY } from "@shared/config/const";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import MarkoTestClassActionCell from "./MarkoTestClassData/MarkoTestClassActionCell";
import MarkoTestTableServer from "./MarkoTestTableServer";
import { useObjectsStore } from "@shared/stores/objects";
import { useGetObjects } from "@shared/hooks/useGetObjects";
import { findChildObjects_TEST } from '@shared/utils/objects';
import { getIncidents } from '@shared/api/Incidents'
import { createMonitoringObjectName, findParentName } from "@entities/incidents/IncidentTableContainer/utils";
import { Link } from 'react-router-dom'
import { getLocalTimeFromUTC } from '@shared/utils/datetime'
import { calcDuration2, incidentColumns, incidentStatuses } from "@entities/incidents/IncidentTableContainer/prepare"
import { classesGroups, forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import MarkoTestTableUnited from "./MarkoTestTableUnited";




const MarkoTestTableIncidents: FC = () => {
  
    const packages = useApi2(getPackages)
    const classes = useClassesStore((st) => [...st.store.data].sort((a, b) => b.id - a.id))
    const stereotypes = useApi2(getClassStereotypes)

    const navigate = useNavigate()

    const findObject = useObjectsStore((st) => (id: number) => st.getByIndex('id', id))
        const objects = useGetObjects()

    const incidents = useApi2(
            (payload?: any) => getIncidents((payload || {})),
            { onmount: false } ,
    )

    const colDefs = [
        { 
            key: 'id',
            field: "id",
            headerName: 'ID',
            checkboxSelection: true,
            headerCheckboxSelection: true,
        },
        { 
            key: 'buildings',
            field: "buildings",
            headerName: 'Здание',
            filter: false,
            sortable: false
        },
        { 
            key: 'object_id',
            field: "object_id",
            headerName: 'ID объекта' 
        },
        { 
            key: 'monitoringObject',
            field: "monitoringObject",
            headerName: 'Объект мониторинга',
            filter: false,
            sortable: false
        },
        { 
            key: 'severity_level',
            field: "severity_level",
            headerName: 'Уровень критичности' 
        },
        { 
            key: 'favor',
            field: "favor",
            headerName: 'Услуга',
            filter: false,
            sortable: false 
        },
        { 
            key: 'services',
            field: "services",
            headerName: 'Сервис',
            filter: false,
            sortable: false 
        },
        { 
            key: 'name',
            field: "name",
            headerName: 'Название инцидента' 
        },
        { 
            key: 'description',
            field: "description",
            headerName: 'Описание инцидента' 
        },
        { 
            key: 'started_at',
            field: "started_at",
            headerName: 'Дата и время начала' 
        },
        { 
            key: 'finished_at',
            field: "finished_at",
            headerName: 'Дата и время окончания' 
        },
        { 
            key: 'sd_case_number',
            field: "sd_case_number",
            headerName: 'Номер заявки в SD',
            filter: false,
            sortable: false 
        },
        { 
            key: 'sd_application_status',
            field: "sd_application_status",
            headerName: 'Статус решения SD' 
        },
        { 
            key: 'sd_responsible_name',
            field: "sd_responsible_name",
            headerName: 'Ответственный специалист',
            filter: false,
            sortable: false 
        },
        { 
            key: 'attempts',
            field: "attempts",
            headerName: 'Количество неуспешных отпрпавок',
            filter: false,
            sortable: false
        },
        { 
            key: 'sync_status',
            field: "sync_status",
            headerName: 'Статус синхронизации' 
        },
        { 
            key: 'last_sync_date',
            field: "last_sync_date",
            headerName: 'Дата и время последней попытки синхронизации',
            filter: false,
            sortable: false 
        },
        { 
            key: 'task_state_date',
            field: "task_state_date",
            headerName: 'Дата получения состояния заявки' 
        },
        { 
            key: 'kmut_url',
            field: "kmut_url",
            headerName: 'URL карточки инцидента в ИС',
            filter: false,
            sortable: false
        },
        { 
            key: 'duration',
            field: "duration",
            headerName: 'Длительность',
            filter: false,
            sortable: false 
        },
        { 
            key: 'finished',
            field: "finished",
            headerName: 'Статус инцидента',
            filter: false,
            sortable: false
        },
        { 
            key: 'transition',
            field: "transition",
            headerName: 'Переход',
            filter: false,
            sortable: false
        },
      ];


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
        }, [incidents?.data])

    return (
        <MarkoTestTableUnited
            tableRow={rows}
            columns={colDefs}
            tableStyle={{ width: "100%", height: "50%"}}
            server={incidents}
            pagination={incidents?.pagination?.total}
            autoUpdate={true}
        />
    )
}


export default MarkoTestTableIncidents
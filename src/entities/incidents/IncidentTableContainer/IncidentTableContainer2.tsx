import { useApi2 } from '@shared/hooks/useApi2';
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable';
import { FC, useEffect, useMemo, useState } from 'react';
import { calcDuration2, incidentColumns, incidentStatuses } from './prepare';
import { Button, Space, Spin } from 'antd';
import { SelectOutlined, ExceptionOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { getIncidents } from '@shared/api/Incidents';
import { IncidentModal2 } from '../IncidentModal/IncidentModal2';
import { selectObjects, useObjectsStore } from '@shared/stores/objects';
import { createMonitoringObjectName, findParentName } from './utils';
import { findChildObjects_TEST } from '@shared/utils/objects';
import { classesGroups, forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import { getLocalTimeFromUTC } from '@shared/utils/datetime';
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject';
import { getURL } from '@shared/utils/nav';
import dayjs from 'dayjs';
import { IIncident } from '@shared/types/incidents';
import { useGetObjects } from '@shared/hooks/useGetObjects';

export interface IIncidentTableProps {
    attributeIds?: Partial<Record<'manufacturer' | 'model', number>>
    objectIds?: number[]
    periodForModal?: { start: any, end: any }
    message?: string,
    chosenColumns?: string[]
    hideChosenColumns?: boolean
}

const mode: 'server' | 'front' = 'front'

/**
 * Таблица инцидентов (не относится к UML схеме)
 * 
 * @param attributeIds - ключи атрибутов для поиска значений, связанных с этими атрибутами
 * @param chosenColumns - ключи колонок, которые необходимо выводить
 * @hideChosenColumns - маркер, который определяет, показывать или скрывать выбранные колонки
 */
export const IncidentTableContainer2: FC<IIncidentTableProps> = ({
    attributeIds,
    objectIds,
    periodForModal,
    message,
    chosenColumns,
    hideChosenColumns = false
}) => {
    const nav = useNavigate()

    const [rowClickedIncidentId, setRowClickedIncidentId] = useState(0)
    const [incidentsList, setIncidentsList] = useState<IIncident[]>([])
    const [filteredColumns, setFilteredColumns] = useState<
        (
            | {
                serverFilterValueKey: string
                defaultSortOrder: string
                key: string
                title: string
                dataIndex: string
            }
            | {
                key: string
                title: string
                dataIndex: string
                serverFilterValueKey: string
            }
        )[]
            >(incidentColumns)


    const findObject = useObjectsStore((st) => (id: number) => st.getByIndex('id', id))
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    //Фронт или сервер
    const incidents = useApi2(getIncidents, (mode === 'front')
        ? { onmount: true, autoUpdate: 60000 } : { onmount: false })

    //Получаем инциденты по объектам/объекту с графика за период
    const incidentsInPeriod = async () => {
        const startTime = dayjs.unix(periodForModal.start.time).format('YYYY-MM-DD HH:mm:ss');
        const endTime = dayjs.unix(periodForModal.end.time).format('YYYY-MM-DD HH:mm:ss');

        const incidentsStartedRes = await getIncidents({
            'filter[started_after]': startTime,
            'filter[started_before]': endTime,
        })

        const incidentsFinishedRes = await getIncidents({
            'filter[finished_after]': startTime,
            'filter[finished_before]': endTime,
        })

        const incidentsStarted = incidentsStartedRes.data
        const incidentsFinished = incidentsFinishedRes.data

        return [...incidentsStarted, ...incidentsFinished].filter((incident) => objectIds?.includes(incident.object_id))
    }

    useEffect(() => {
        const incidentsData = async () => {
            //Если пердана точка графика, выводим инциденты за данный период
            if (periodForModal) {
                const data = await incidentsInPeriod()

                setIncidentsList(data);
            } else if (objectIds?.length > 0 && periodForModal === undefined) {
                //Получаем инцидентов по объектам/объекту с графика
                const filterIncidents = incidents?.data.filter((incident) => objectIds?.includes(incident.object_id))
                    ?.filter((incident) => incident.finished_at === null)

                setIncidentsList(filterIncidents)
            } else {
                //Выводим все инциденты в таблице
                setIncidentsList(incidents?.data)
            }
        }

        incidentsData();
    }, [periodForModal, objectIds?.length, incidents?.data])

    //Фронт или сервер
    const tableServer = (mode === 'front')
        ? undefined
        : {
            autoUpdate: 65_000,
            request: async ({ filterValue, ...meta }) => {
                if (filterValue) {
                    return incidents.request({ ...meta })
                } else {
                    return incidents.request(meta)
                }
            },
            filter: async (config) => {
                const payload = {
                    ...config,
                    per_page: config?.pageSize,
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
        }

    const rows = useMemo(() => {
        return incidentsList?.map((incident) => {
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
                monitoringObject: createMonitoringObjectName(findObject(incident?.object_id), {
                    manufacturer: attributeIds?.manufacturer,
                    model: attributeIds?.model,
                }),
                ...(['buildings', 'favor', 'services'].reduce((hash, key) => ({
                    ...hash, [key]: findParentName(parents, key)
                }), {})),
                url: <Link to={getURL(incidentUrl, 'showcase')} target="_blank">{incidentUrl}</Link>,
                // url: <Link to={incident.kmut_url} target="_blank">{incident.kmut_url}</Link>,
                sync_status: incidentStatuses?.[`${incident?.sync_status}`],
                started_at: getLocalTimeFromUTC(incident?.started_at),
                finished_at: getLocalTimeFromUTC(incident?.finished_at),
                finished: incident?.finished_at ? 'Закрыт' : 'Открыт',
                duration: `${calcDuration2(
                    getLocalTimeFromUTC(incident.started_at),
                    incident.finished_at ? getLocalTimeFromUTC(incident.finished_at) : undefined
                )}`,
                transition: (
                    <Space>
                        <ButtonShowObject
                            shape="circle"
                            title="Карточка объекта"
                            icon={<SelectOutlined />}
                            id={incident.object_id}
                            noToggle
                            modalProps={{
                                children: (
                                    <IncidentModal2
                                        onClose={() => setRowClickedIncidentId(0)}
                                        incident={incidentsList?.find(({ id }) => {
                                            return id === rowClickedIncidentId
                                        })}
                                    />
                                )
                            }}
                        />
                        <Button
                            shape="circle"
                            title="Информация об инциденте"
                            icon={<ExceptionOutlined />}
                            onClick={(ev) => {
                                ev.stopPropagation()
                                nav(getURL(`${ROUTES.INCIDENTS}/${ROUTES_COMMON.SHOW}/${incident.id}`, 'showcase'))
                                // nav(`/${ROUTES.INCIDENTS}/${ROUTES_COMMON.SHOW}/${incident.id}`)
                            }}
                        />
                    </Space>
                )
            }
        })//.sort((a, b) => b.id - a.id)
    }, [incidentsList])

    useEffect(() => {
        if (chosenColumns) {
            const localFinalColumns = hideChosenColumns
                ? incidentColumns.filter(cl => chosenColumns.includes(cl.dataIndex) == false)
                : incidentColumns.filter(cl => chosenColumns.includes(cl.dataIndex))

            setFilteredColumns(localFinalColumns)
        }
    }, [chosenColumns])


    const incidentsTableList = () => {
        return (
            <>
                <EditTable
                    paginator={{ page: 1, pageSize: 20, enablePageSelector: false }}
                    tableId="incidents-table"
                    columns={filteredColumns}
                    rows={rows}
                    loading={rows.length === 0 && incidents.loading}
                    scroll={{ x: 2000 }}
                    onRow={(row) => ({
                        onClick: () => setRowClickedIncidentId(row.id),
                    })}
                    initialPage={1}
                    server={tableServer}
                />
                <IncidentModal2
                    onClose={() => setRowClickedIncidentId(0)}
                    incident={incidents.data.find(({ id }) => id === rowClickedIncidentId)}
                />
            </>
        )
    }
    const getRender = () => {
        if (objectIds?.length > 0 || periodForModal !== undefined) {
            return (
                rows.length === 0 && incidents.loading ?
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}
                    >
                        <Spin size="large" />
                    </div>
                    : (incidentsList?.length > 0 ? incidentsTableList() : message)
            )
        }

        return incidentsTableList()
    }

    return (
        <>{getRender()}</>
    )
}
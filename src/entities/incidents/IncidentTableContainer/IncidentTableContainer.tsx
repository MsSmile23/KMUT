import { useAttributesStore } from '@shared/stores/attributes'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { FC, useMemo, useState } from 'react'
import { ML, additionalColumns, baseColumns, calcDuration, findAttribute, findAttributeValue } from './prepare'
import './incident-table.css'
import { createMonitoringObjectName, createValueIndexes, findObjectByAttributeId } from './utils'
import { Button, Space } from 'antd'
import { LineChartOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { IncidentObjectModal } from '../IncidentModalObject/IncidentObjectModal'
import { IncidentModal } from '../IncidentModal/IncidentModal'
import { createInfo } from '../IncidentModal/data'
import { findChildObjects_TEST } from '@shared/utils/objects'
import { classesGroups, forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { OAView } from '@entities/objects/OAView/OAView'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { useNavigate } from 'react-router-dom';
import { getURL } from '@shared/utils/nav'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetObjects } from '@shared/hooks/useGetObjects'

const divider = '_'
const createAttributeKey = (id: number) => `incidentAttributeId${divider}${id}`

type TAttributeName = string // 'criticality' | 'manufacturer' | 'model'
interface Props {
    incidentClassId?: number
    incidentRangeAttributeIds?: [number, number]
    monitoringAttributeId?: number
    attributesColumnsOrder?: number[]
    attributeIds?: Partial<Record<TAttributeName, number>>
    excludedColumnAttributeIds: number[]
}

/**
 * Таблица инцидентов
 * 
 * @param incidentClassId - ключ класса инцидента, по которому фильтруются ряды и атрибуты
 * @param monitoringAtttributeId - ключ атрибута инцидента для получения названия объекта мониторинга
 * @param attributesColumnsOrder - ключ атрибутов в порядке их следования в качестве столбцов
 * @param incidentRangeAttributeIds - ключ атрибута даты завершения инцидента
 */
export const IncidentTableContainer: FC<Props> = ({ 
    incidentClassId, 
    incidentRangeAttributeIds,
    monitoringAttributeId,
    attributesColumnsOrder, 
    attributeIds,
    excludedColumnAttributeIds,
}) => {
    const [ incidentStartTime = 0, incdentFinishedTime = 0 ] = incidentRangeAttributeIds

    const [ objectModalId, setObjectModalId ] = useState(0)
    const [ infoModalId, setInfoModalId ] = useState(0)
    const [ selectedRow, setSelectedRow ] = useState<any>()

    const navigate = useNavigate()
    const theme = useTheme()
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const incidents = objects.filter((obj) => obj.class_id === incidentClassId)
    const attributes = useAttributesStore((st) => st.store.data.filter((attr) => {
        return attr.classes_ids.map(({ id }) => id).includes(incidentClassId)
    }))

    const attributesColumns = attributes.map((attr) => {
        const key = createAttributeKey(attr.id)

        return {
            key,
            attributeId: attr.id,
            dataIndex: key,
            valueIndex: {
                filter: `${key}Filter`,
                sort: `${key}Sort`,
                print: `${key}Print`
            },
            title: attr.name
        }
    }).filter((col) => !excludedColumnAttributeIds?.includes(col.attributeId))
    const attributesColumnsNotSorted = attributesColumns.filter((col) => {
        const id = `${col.key}`.split(divider)[1]

        return !attributesColumnsOrder.includes(Number(id))
    })
    const attributesColumnsSorted = attributesColumnsOrder.map((id) => {
        return attributesColumns.find((col) => `${col.key}`.includes(`${id}`))
    }).filter(Boolean)

    // todo: интегрировать (сейчас это пример запроса колонок sd)
    const externalTicket = {
        attributeId: undefined, 
        id: undefined, 
        stateAttributeId: undefined,
        baseUrl: theme?.externalTicketUrl ?? 'https://fest2024.kmyt.ru'
    } 
    
    externalTicket.attributeId = ML.getAttributeBindId({
        attributesBind: forumThemeConfig.incidents.attributesBind, 
        mnemo: 'externalTickedId'
    })
    externalTicket.stateAttributeId = ML.getAttributeBindId({
        attributesBind: forumThemeConfig.incidents.attributesBind, 
        mnemo: 'externalTickedState'
    }) 

    const columns = [
        ...baseColumns,
        ...attributesColumnsSorted,
        ...attributesColumnsNotSorted,
        ...additionalColumns,
    ]

    const rows = useMemo(() => incidents.map((incident) => {
        const monitoringObject = findObjectByAttributeId(objects, incident, monitoringAttributeId)

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

        const finishedTimeAttribute = findAttribute(incident, incdentFinishedTime)

        return {
            key: `incident-row-${incident.id}`,
            id: incident.id,
            building: parents.find((parent) => classesGroups.buildings.includes(parent.class_id))?.name,
            favor: parents.find((parent) => forumThemeConfig.classesGroups.favor.includes(parent.class_id))?.name,
            service: parents.find((parent) => forumThemeConfig.classesGroups.services.includes(parent.class_id))?.name,
            criticality: findAttributeValue(incident, attributeIds?.criticality),
            monitoringObject: createMonitoringObjectName(monitoringObject, {
                manufacturer: attributeIds?.manufacturer,
                model: attributeIds?.model,
            }),
            // todo: убрать в отдельный файл после появления класса ML
            ...attributes.reduce((hash, attr) => {
                const key = createAttributeKey(attr.id)
                const commonAttribute = findAttribute(incident, attr.id)
                const commonValueIndexes = createValueIndexes(key, commonAttribute?.attribute_value)

                if (attr.data_type.mnemo == 'datetime_UTC') {
                    return {
                        ...hash,
                        ...commonValueIndexes,
                        [key]: (
                            <OAView
                                onClick={(ev) => ev.stopPropagation()}
                                objectAttribute={commonAttribute}
                            />
                        )
                    }
                }

                if (key.includes(`${externalTicket.attributeId}`)) {
                    const attribute = findAttribute(incident, externalTicket.attributeId)

                    return { 
                        ...hash,
                        ...createValueIndexes(key, attribute?.attribute_value),
                        [key]: (
                            <OAView
                                onClick={(ev) => ev.stopPropagation()} 
                                objectAttribute={attribute} 
                            />
                        )
                    }
                }

                if (key.includes(`${externalTicket.stateAttributeId}`)) {
                    const attribute = findAttribute(incident, externalTicket.stateAttributeId)

                    return {
                        ...hash,
                        ...createValueIndexes(key, attribute?.attribute_value),
                        [key]: <OAView enableStateText objectAttribute={attribute} />
                    }
                }

                return {
                    ...hash,
                    ...commonValueIndexes,
                    [key]: commonAttribute 
                        ? (<OAView objectAttribute={commonAttribute} />)
                        : commonAttribute
                }
            }, {}),
            finished: finishedTimeAttribute?.attribute_value ? 'Закрыт' : 'Открыт',
            duration: `${calcDuration(incident, incidentStartTime, incdentFinishedTime)}`,
            transition: (
                <Space>
                    <Button 
                        shape="circle"
                        title="Карточка инцидента"
                        icon={<EyeOutlined />}
                        onClick={(ev) => {
                            ev.stopPropagation()
                            navigate(getURL(
                                `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${incident.id}`, 
                                'showcase'
                            ))
                            // navigate(
                            //     `/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${incident.id}`
                            // )
                        }}
                    />
                    <Button 
                        shape="circle" 
                        title="Редактировать инцидент"
                        icon={<EditOutlined />} 
                    />
                    <Button 
                        shape="circle"
                        title="Краткая информация об инциденте"
                        icon={<LineChartOutlined />} 
                        onClick={(ev) => {
                            ev.stopPropagation()
                            setObjectModalId(incident.id)
                        }} 
                    />
                </Space>
            )
        }
    }), [incidents])

    const handleRowClick = (id: number,) => {
        if (objectModalId) {
            return
        }

        setInfoModalId(id)
    }

    const data = columns.map((col) => ({
        key: col?.key,
        value: selectedRow?.[col?.key as string],
        title: (col?.title as any)?.props ? (col?.title as any).props?.children : col?.title,
    }))
        .filter((col) => !['width', 'transition'].includes(col?.key as string))
        .reduce((acc, col) => ({ ...acc, [col?.key as string]: col }), {})

    const incident = incidents.find(({ id }) => selectedRow?.id === id)
    const monitoringObject = findObjectByAttributeId(objects, incident, monitoringAttributeId)
    const updatedData = { ...data, ...createInfo({ monitoringObject, attributeIds }) }

    return (
        <>
            <IncidentObjectModal id={objectModalId} onClose={() => setObjectModalId(0)} />
            <IncidentModal 
                id={infoModalId} 
                onClose={() => setInfoModalId(0)}
                data={Object.values(updatedData)} 
            />
            <EditTable
                rowClassName="incident-table"
                columns={columns as any[]}
                rows={rows.slice().sort((a, b) => b.id - a.id)} 
                tableId="incidents"
                onRow={(row) => ({ onClick: () => {
                    handleRowClick(row.id)
                    setSelectedRow(row)
                } })}
                scroll={{ x: 1200 }}
            />
        </>
    )
}
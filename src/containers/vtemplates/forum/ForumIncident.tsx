import { FC, useEffect } from 'react'
import { Row, Col, Table } from 'antd'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { IObject } from '@shared/types/objects'
import { ObjectStateHistory } from '@entities/states/ObjectStateHistory/ObjectStateHistory'
import { useApi2 } from '@shared/hooks/useApi2'
import { getIncidentById } from '@shared/api/Incidents'
import { incidentColumnsKeysTitles, incidentStatuses } from '@entities/incidents/IncidentTableContainer/prepare'
import { IIncident } from '@shared/types/incidents'
import { getLocalTimeFromUTC } from '@shared/utils/datetime'
import { useObjectsStore } from '@shared/stores/objects'
import { findChildObjects_TEST } from '@shared/utils/objects'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ECConfig } from '@shared/config';

interface IForumFavourVtemplateProps {
    object?: IObject
    incidentId?: number
    initialIncident?: Partial<IIncident>
    loading?: boolean
}

const columns = [
    { key: 'title', dataIndex: 'title', title: 'Название' },
    { key: 'value', dataIndex: 'value', title: 'Значение' },
]

const commonKeys: (keyof typeof incidentColumnsKeysTitles)[] = [
    'started_at', 
    'finished_at',
    'object_id',
    'severity_level',
    'name',
    'description'
]

const externalKeys: (keyof typeof incidentColumnsKeysTitles)[] = [
    'sd_case_number',
    'sd_application_status',
    'sd_responsible_name',
    'last_sync_date'
]

export const ForumIncident: FC<IForumFavourVtemplateProps> = ({ 
    incidentId, 
    initialIncident,
    loading,
}) => {
    const incident = useApi2(getIncidentById, { onmount: 'item', state: initialIncident })

    useEffect(() => {
        if (initialIncident?.id) {
            return
        }

        if (incidentId) {
            incident.request(Number(incidentId))
        }
    }, [incident.request, initialIncident?.id, incidentId])

    const rows = Object.entries(incident.data || {}).map(([ key, value ]) => {
        let modifiedValue = value

        if (ECConfig.incidents.fieldsUTC.includes(key)) {
            modifiedValue = getLocalTimeFromUTC(value)
        }

        return { key, value: modifiedValue, title: incidentColumnsKeysTitles[key] }
    })
    
    const objects = useObjectsStore((st) => st.store.data)
    const device = useObjectsStore((st) => st.getByIndex('id', incident.data?.object_id))

    // todo: сделать нормальную функцию поиска родительских объектов
    const parents = findChildObjects_TEST({
        objects,
        object: device,
        targetClasses: [
            ...forumThemeConfig.classesGroups.buildings,
            ...forumThemeConfig.classesGroups.floors,
            ...forumThemeConfig.classesGroups.rooms,
        ],
        searchByIndex: true
    }).map((obj) => {
        let order = 0
        let prefix = ''

        switch (obj?.class.class_stereotype?.mnemo) {
            case 'floor': {
                order = 1
                prefix = 'Этаж'
                break
            }
            case 'room': {
                order = 2
                break
            }
            default: //
        }

        return { ...obj, order, prefix }
    }).slice().sort((a, b) => a?.order - b?.order)

    const commonRows = [
        { 
            key: 'location', 
            title: 'Местоположение', 
            value: parents.reduce((title, obj, i) => {
                const isLast = i === parents.length - 1
                const includesFloor = obj.name.includes('Этаж')

                return title + (includesFloor ? '' : obj.prefix) + obj.name + (isLast ? '' : ', ')
            }, '')
        },
        { key: 'device', title: 'Оборудование', value: device?.name },
        ...commonKeys.map((key) => rows.find((row) => row.key === key))
    ]
    const externalRows = externalKeys.map((key) => rows.find((row) => row.key === key))

    return (
        <Row gutter={10}>
            <Col span={12}>       
                <WrapperWidget height={400} title="Общая информация">
                    <Table 
                        columns={columns}
                        dataSource={commonRows}
                        loading={loading || incident.loading}
                        showHeader={false}
                        pagination={false}
                    />
                </WrapperWidget>
            </Col>
            <Col span={12}>
                <WrapperWidget height={400} title="Система обработки заявок">
                    <Table
                        columns={columns}
                        dataSource={externalRows}
                        loading={loading || incident.loading}
                        showHeader={false}
                        pagination={false}
                    />
                </WrapperWidget>
            </Col>
            <Col span={24} className="gutter-row">
                <WrapperWidget
                    title="История статусов"
                    height={250}
                    titleStyle={{ fontSize: '16px' }}
                >
                    {incident.data?.object_id && (
                        <ObjectStateHistory settings={{ entityId: incident.data.object_id, targetEntity: 'object' }} />
                    )}
                </WrapperWidget>
            </Col>
        </Row> 
    )
}
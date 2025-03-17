import { getNotifications } from '@shared/api/Objects/Models/getNotifications/getNotifications'
import { useApi2 } from '@shared/hooks/useApi2'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { generalStore, selectLastNotifications } from '@shared/stores/general'
import { IObjectAttribute } from '@shared/types/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { FC, useMemo } from 'react'

/* 

значок берём этот, цвет FFA500
<WarningOutlined />

*/

const createKey = (oa: IObjectAttribute) => `oa-${oa.attribute_id}`

export const ObjectNotificationTable: FC = () => {
    const notifierStore = generalStore(selectLastNotifications)
    const notifications = notifierStore.lastNotifications
    // const notifications = useApi2(() => getNotifications(), { autoUpdate: 65_000 })
    const attributes = useAttributesStore(selectAttributes)
    
    console.log('lastNotificationsStore', notifierStore.lastNotifications)

    const attributeHeaders = useMemo(() => {
        const last = notifications?.length - 1
        // const last = notifications?.data?.length - 1

        return notifications?.[last]?.object_attributes.map((oa) => {
        // return notifications?.data?.[last]?.object_attributes.map((oa) => {
            const title = oa?.attribute?.name 
                ? oa?.attribute?.name
                : attributes.find((attr) => attr.id === oa.attribute_id)?.name || `Атрибут ${oa.attribute_id}`

            return {
                title,
                key: createKey(oa as IObjectAttribute),
                dataIndex: createKey(oa as IObjectAttribute),
            }
        })
    }, [notifications])
    // }, [notifications?.data])
    
    const Dot: FC<{ unread: boolean, id?: number }> = ({ unread, id }) => (
        <div 
            onClick={() => id && notifierStore.toggleUnread(id)}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '20px', 
                width: '20px' 
            }}
        >
            <span 
                style={{ 
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    fontSize: '20px', 
                    background: unread ? '#cccccc' : '#ffffff',
                    border: '1px solid #cccccc',
                    borderRadius: '50%',
                    cursor: 'pointer',
                }}
            >
            </span>
        </div>
    )
    const columns = [{
        key: 'markUnread', 
        dataIndex: 'markUnread', 
        title: (
            <Dot unread={true} />
        ),
        showSorterTooltip: false
    }, { 
        key: 'id', 
        dataIndex: 'id', 
        title: 'ID' 
    }].concat(attributeHeaders)

    const rows = useMemo(() => notifications?.map((row) => {
    // const rows = useMemo(() => notifications?.data?.map((row) => {
        const acc = row.object_attributes.reduce((total, oa) => {
            return { 
                ...total, 
                [createKey(oa as IObjectAttribute)]: row.unread 
                    ? <b>{oa.attribute_value}</b> 
                    : oa.attribute_value 
            }
        }, {}) 

        return ({
            ...acc,
            key: String(row.id),
            // key: `notif-${row.id}`,
            id: row.unread ? <b>{row.id}</b> : row.id,
            markUnread: <Dot unread={row.unread} id={row.id} />,
        })
    }).sort((a, b) => Number(b.key) - Number(a.key)), [notifications])
    // }).sort((a, b) => a.id - b.id), [notifications?.data])

    return (
        <EditTable 
            tableId="notification-table"
            columns={columns}
            rows={rows}
            // loading={notifications.loading}
            scroll={{ x: 1200 }}
            // pagination={true}
            paginator={true}
        />
    )
}
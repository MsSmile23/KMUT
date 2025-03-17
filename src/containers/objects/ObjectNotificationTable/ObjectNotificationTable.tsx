import { getNotifications } from '@shared/api/Objects/Models/getNotifications/getNotifications'
import { useApi2 } from '@shared/hooks/useApi2'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { IObjectAttribute } from '@shared/types/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { FC, useMemo } from 'react'

/* 

значок берём этот, цвет FFA500
<WarningOutlined />

*/

const createKey = (oa: IObjectAttribute) => `oa-${oa.attribute_id}`

export const ObjectNotificationTable: FC = () => {
    const notifications = useApi2(() => getNotifications(), { autoUpdate: 65_000 })
    const attributes = useAttributesStore(selectAttributes)

    const attributeHeaders = useMemo(() => {
        const last = notifications?.data?.length - 1

        return notifications?.data?.[last]?.object_attributes.map((oa) => {
            const title = oa?.attribute?.name 
                ? oa?.attribute?.name
                : attributes.find((attr) => attr.id === oa.attribute_id)?.name || `Атрибут ${oa.attribute_id}`

            return {
                title,
                key: createKey(oa as IObjectAttribute),
                dataIndex: createKey(oa as IObjectAttribute),
            }
        })
    }, [notifications?.data])
    
    const columns = [{ key: 'id', dataIndex: 'id', title: 'ID' }].concat(attributeHeaders)

    const rows = useMemo(() => notifications?.data?.map((row) => {
        const acc = row.object_attributes.reduce((total, oa) => {
            return { ...total, [createKey(oa as IObjectAttribute)]: oa.attribute_value }
        }, {}) 

        return ({
            ...acc,
            key: `notification-${row.id}`,
            id: row.id,
        })
    }).sort((a, b) => b.id - a.id), [notifications?.data])

    return (
        <EditTable 
            tableId="notification-table"
            columns={columns}
            rows={rows}
            loading={notifications.loading}
            scroll={{ x: 1200 }}
            pagination={{ pageSize: 10 }}
            paginator={true}
        />
    )
}